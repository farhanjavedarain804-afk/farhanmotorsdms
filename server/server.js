import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';
import { initDatabase, db, query } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 5000;

// Setup uploads folder
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB limit
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

// -------------------------------------------------------------
// HEALTH & DB STATUS
// -------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: db.isMySQL() ? 'MySQL (Active)' : 'Local Storage Fallback (MySQL Offline)',
    host: process.env.DB_HOST || 'localhost',
    dbName: process.env.DB_NAME || 'farhan_motors',
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, pin } = req.body;

    // Check PIN login
    if (pin) {
      if (pin === '4457') {
        const adminUser = {
          id: 'usr_admin_001',
          email: 'admin@farhanmotors.com',
          full_name: 'Farhan Ali (Managing Director)'
        };
        return res.json({
          user: adminUser,
          session: { access_token: 'fm_token_admin_session', user: adminUser },
          roles: ['admin'],
          profile: {
            full_name: 'Farhan Ali (Managing Director)',
            username: 'admin',
            contact: '+923284880257',
            cnic: '38201-1234567-1'
          }
        });
      }
      return res.status(401).json({ error: 'Invalid PIN. Please try again.' });
    }

    // Default administrator fallback check
    if (email === 'admin@farhanmotors.com' && password === 'admin123') {
      const adminUser = {
        id: 'usr_admin_001',
        email: 'admin@farhanmotors.com',
        full_name: 'Farhan Ali (Managing Director)'
      };
      return res.json({
        user: adminUser,
        session: { access_token: 'fm_token_admin_session', user: adminUser },
        roles: ['admin'],
        profile: {
          full_name: 'Farhan Ali (Managing Director)',
          username: 'admin',
          contact: '+923284880257',
          cnic: '38201-1234567-1'
        }
      });
    }

    // Check in users table
    const users = await db.getTable('users', { filters: { email } });
    if (users.length > 0) {
      const u = users[0];
      if (u.password_hash === password) {
        const roles = (await db.getTable('user_roles', { filters: { user_id: u.id } })).map(r => r.role);
        const profiles = await db.getTable('profiles', { filters: { id: u.id } });
        const profile = profiles[0] || { full_name: u.full_name, username: u.email.split('@')[0] };

        const userData = { id: u.id, email: u.email, full_name: u.full_name };
        return res.json({
          user: userData,
          session: { access_token: `fm_token_${u.id}`, user: userData },
          roles: roles.length > 0 ? roles : ['staff'],
          profile
        });
      }
    }

    return res.status(401).json({ error: 'Invalid email or password.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/session', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ session: null, user: null });
  }
  // Return default active admin session
  const adminUser = {
    id: 'usr_admin_001',
    email: 'admin@farhanmotors.com',
    full_name: 'Farhan Ali (Managing Director)'
  };
  res.json({
    session: { access_token: 'fm_token_admin_session', user: adminUser },
    user: adminUser,
    roles: ['admin']
  });
});

app.post('/api/auth/logout', (_req, res) => {
  res.json({ success: true });
});

// -------------------------------------------------------------
// GENERIC TABLE CRUD API (MATCHES useTable & Supabase .from())
// -------------------------------------------------------------
app.get('/api/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const { order, ascending, limit, ...filters } = req.query;

    const data = await db.getTable(tableName, {
      order,
      ascending: ascending === 'true' || ascending === true,
      filters,
      limit
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/table/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    const record = await db.insert(tableName, req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/table/:tableName/:id', async (req, res) => {
  try {
    const { tableName, id } = req.params;
    const updated = await db.update(tableName, id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/table/:tableName/:id', async (req, res) => {
  try {
    const { tableName, id } = req.params;
    await db.delete(tableName, id);
    res.json({ success: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// FILE UPLOAD (DOCUMENTS & ATTACHMENTS)
// -------------------------------------------------------------
app.post('/api/upload', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }
    const uploaded = req.files.map(f => ({
      name: f.originalname,
      filename: f.filename,
      size: f.size,
      mimetype: f.mimetype,
      url: `/uploads/${f.filename}`
    }));
    res.json({ files: uploaded, count: uploaded.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// SERVE PRODUCTION FRONTEND (DIST FOLDER)
// -------------------------------------------------------------
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    }
  });
} else {
  app.get('/', (_req, res) => {
    res.send('<h2>Farhan Motors Server Active</h2><p>Building frontend assets...</p>');
  });
}

// Start Server immediately so Hostinger proxy binds without 503 timeout
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚗 Farhan Motors Server listening on 0.0.0.0:${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`=======================================================`);
  
  // Initialize Database asynchronously in background
  initDatabase().then(() => {
    console.log(`📊 DB Mode: ${db.isMySQL() ? 'MySQL Server (Connected)' : 'Local Storage Mode'}`);
  }).catch((err) => {
    console.warn(`[DB Warning]:`, err.message);
  });
});

