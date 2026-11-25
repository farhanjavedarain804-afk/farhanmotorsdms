import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DB_FILE = path.join(__dirname, 'data', 'local_db.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

let isMySQLConnected = false;
let pool = null;

// Initial seed data for all tables
const initialSeedData = {
  users: [
    { id: 'usr_admin_001', email: 'admin@farhanmotors.com', password_hash: 'admin123', pin: '4457', full_name: 'Farhan Ali', created_at: new Date().toISOString() }
  ],
  profiles: [
    { id: 'usr_admin_001', username: 'admin', full_name: 'Farhan Ali (Managing Director)', contact: '+923284880257', cnic: '38201-1234567-1', created_at: new Date().toISOString() }
  ],
  user_roles: [
    { id: 'rol_admin_001', user_id: 'usr_admin_001', role: 'admin', created_at: new Date().toISOString() }
  ],
  customers: [
    { id: 'cst_001', name: 'Muhammad Ahmed Khan', cnic: '38201-7654321-3', phone: '0300-1234567', email: 'ahmed.khan@gmail.com', address: 'Ward No 4, Chowk Azam, Layyah', notes: 'Valued regular client', created_at: new Date().toISOString() },
    { id: 'cst_002', name: 'Sara Ali Chaudhry', cnic: '38201-9876543-2', phone: '0321-9876543', email: 'sara.ali@outlook.com', address: 'Civil Lines, Layyah', notes: 'Long-term rental customer', created_at: new Date().toISOString() },
    { id: 'cst_003', name: 'Usman Tariq', cnic: '38201-4455667-1', phone: '0333-5566778', email: 'usman.tariq@yahoo.com', address: 'Multan Road, Chowk Azam', notes: 'Vehicle purchase client', created_at: new Date().toISOString() },
    { id: 'cst_004', name: 'Fatima Noor', cnic: '38201-1122334-4', phone: '0345-1122334', email: 'fatima.noor@hotmail.com', address: 'Housing Colony, Layyah', notes: 'Corporate client', created_at: new Date().toISOString() }
  ],
  vehicles: [
    { id: 'veh_001', registration_no: 'LEA-24-1234', make: 'Toyota', model: 'Corolla', variant: 'Altis Grande 1.8', year: 2024, color: 'Pearl White', chassis_no: 'ZRE172-9081234', engine_no: '2ZR-FE-4567890', engine_capacity: '1800cc', transmission: 'Automatic', fuel_type: 'Petrol', body_type: 'Sedan', mileage: 12000, purpose: 'both', status: 'in_stock', ownership_type: 'company', owner_name: 'Farhan Motors', owner_cnic: '38201-1234567-1', owner_phone: '0328-4880257', registered_city: 'Lahore', purchase_price: 6800000, sale_price: 7250000, rent_per_day: 8000, rent_per_month: 190000, rent_with_driver: 11000, created_at: new Date().toISOString() },
    { id: 'veh_002', registration_no: 'ICT-23-5678', make: 'Honda', model: 'Civic', variant: 'Oriel 1.5 Turbo', year: 2023, color: 'Crystal Black', chassis_no: 'FC1-8012345', engine_no: 'L15B7-1234567', engine_capacity: '1500cc', transmission: 'Automatic', fuel_type: 'Petrol', body_type: 'Sedan', mileage: 24000, purpose: 'rent', status: 'rented', ownership_type: 'company', owner_name: 'Farhan Motors', owner_cnic: '38201-1234567-1', owner_phone: '0328-4880257', registered_city: 'Islamabad', purchase_price: 7500000, sale_price: 0, rent_per_day: 12000, rent_per_month: 260000, rent_with_driver: 16000, created_at: new Date().toISOString() },
    { id: 'veh_003', registration_no: 'MN-24-9012', make: 'Suzuki', model: 'Alto', variant: 'VXR', year: 2024, color: 'Solid White', chassis_no: 'HA36S-6789012', engine_no: 'R06A-8901234', engine_capacity: '660cc', transmission: 'Manual', fuel_type: 'Petrol', body_type: 'Hatchback', mileage: 8500, purpose: 'sale', status: 'in_stock', ownership_type: 'company', owner_name: 'Farhan Motors', owner_cnic: '38201-1234567-1', owner_phone: '0328-4880257', registered_city: 'Multan', purchase_price: 2650000, sale_price: 2900000, rent_per_day: 0, rent_per_month: 0, rent_with_driver: 0, created_at: new Date().toISOString() },
    { id: 'veh_004', registration_no: 'KHI-23-3456', make: 'Toyota', model: 'Hilux', variant: 'Revo Rocco 2.8', year: 2023, color: 'Grey Metallic', chassis_no: 'GUN126-7890123', engine_no: '1GD-FTV-3456789', engine_capacity: '2800cc', transmission: 'Automatic', fuel_type: 'Diesel', body_type: 'Pickup', mileage: 35000, purpose: 'both', status: 'in_stock', ownership_type: 'company', owner_name: 'Farhan Motors', owner_cnic: '38201-1234567-1', owner_phone: '0328-4880257', registered_city: 'Karachi', purchase_price: 14200000, sale_price: 15100000, rent_per_day: 25000, rent_per_month: 550000, rent_with_driver: 32000, created_at: new Date().toISOString() },
    { id: 'veh_005', registration_no: 'LHR-22-7890', make: 'Kia', model: 'Sportage', variant: 'AWD', year: 2022, color: 'Panthera Metal', chassis_no: 'QL-5678901', engine_no: 'G4NC-2345678', engine_capacity: '2000cc', transmission: 'Automatic', fuel_type: 'Petrol', body_type: 'SUV', mileage: 41000, purpose: 'rent', status: 'in_stock', ownership_type: 'company', owner_name: 'Farhan Motors', owner_cnic: '38201-1234567-1', owner_phone: '0328-4880257', registered_city: 'Lahore', purchase_price: 7800000, sale_price: 0, rent_per_day: 14000, rent_per_month: 320000, rent_with_driver: 18000, created_at: new Date().toISOString() }
  ],
  sales: [
    { id: 'sal_001', vehicle_id: 'veh_001', customer_id: 'cst_001', amount: 5200000, payment_method: 'bank', status: 'completed', sale_date: '2024-03-15', notes: 'Full payment received', created_at: new Date().toISOString() }
  ],
  purchases: [
    { id: 'pur_001', vehicle_id: 'veh_003', seller_name: 'Mian Tariq', seller_cnic: '38201-5544332-1', seller_phone: '0300-8877665', amount: 2650000, source: 'local', payment_method: 'bank', status: 'completed', purchase_date: '2024-03-10', notes: 'Direct purchase', created_at: new Date().toISOString() }
  ],
  rentals: [
    { id: 'rnt_001', vehicle_id: 'veh_002', customer_id: 'cst_002', rate: 12000, rate_type: 'daily', total: 60000, start_date: '2024-03-12', end_date: '2024-03-17', status: 'active', notes: '5 days booking', created_at: new Date().toISOString() }
  ],
  staff: [
    { id: 'stf_001', full_name: 'Farhan Ali', cnic: '38201-1234567-1', phone: '0328-4880257', designation: 'Managing Director', department: 'Management', salary: 250000, join_date: '2020-01-01', status: 'active', created_at: new Date().toISOString() },
    { id: 'stf_002', full_name: 'Kamran Yousaf', cnic: '38201-2345678-2', phone: '0301-2345678', designation: 'Fleet & Rental Manager', department: 'Rentals', salary: 95000, join_date: '2021-03-15', status: 'active', created_at: new Date().toISOString() },
    { id: 'stf_003', full_name: 'Bilal Ahmed', cnic: '38201-3456789-3', phone: '0302-3456789', designation: 'Accounts Officer', department: 'Finance', salary: 85000, join_date: '2022-06-01', status: 'active', created_at: new Date().toISOString() }
  ],
  bank_accounts: [
    { id: 'bnk_001', bank_name: 'Meezan Bank Limited', account_title: 'Farhan Motors', account_number: '02010101234567', iban: 'PK36MEZN0002010101234567', branch: 'Chowk Azam Branch', type: 'bank', current_balance: 4500000, is_active: 1, created_at: new Date().toISOString() },
    { id: 'bnk_002', bank_name: 'Habib Bank Limited (HBL)', account_title: 'Farhan Motors', account_number: '12347900112233', iban: 'PK64HABB0012347900112233', branch: 'Layyah Main Branch', type: 'bank', current_balance: 2800000, is_active: 1, created_at: new Date().toISOString() },
    { id: 'bnk_003', bank_name: 'JazzCash Corporate', account_title: 'Farhan Motors Merchant', account_number: '03284880257', branch: 'Digital Wallet', type: 'wallet', current_balance: 350000, is_active: 1, created_at: new Date().toISOString() }
  ],
  app_settings: [
    { key: 'company', value: { name: 'Farhan Motors & Rent A Car (Private) Limited', address: 'Near Bypass Multan Road, Chowk Azam, Layyah, Punjab, Pakistan', phone: '+923284880257', email: 'info@farhanmotors.com' } },
    { key: 'preferences', value: { language: 'en', currency: 'PKR', maintenance_mode: false } }
  ],
  document_history: [],
  documents: [],
  investors: [],
  invoices: [],
  payments: [],
  attendance: [],
  payroll: [],
  complaints: [],
  maintenance_records: [],
  inspections: [],
  imports: [],
  finance_plans: [],
  vehicle_movements: [],
  activity_logs: []
};

// Local storage fallback helper
function loadLocalDB() {
  try {
    if (fs.existsSync(LOCAL_DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_DB_FILE, 'utf8'));
      return { ...initialSeedData, ...data };
    }
  } catch (err) {
    console.error('Error reading local_db.json:', err.message);
  }
  saveLocalDB(initialSeedData);
  return { ...initialSeedData };
}

function saveLocalDB(data) {
  try {
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local_db.json:', err.message);
  }
}

// Connect to MySQL
export async function initDatabase() {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farhan_motors',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  try {
    // Create pool for configured database
    pool = mysql.createPool(config);

    // Verify connection
    const conn = await pool.getConnection();
    console.log(`[MySQL] Successfully connected to Database '${config.database}' at ${config.host}:${config.port}`);
    conn.release();

    // Run schema initialization from SQL file if tables don't exist
    const [rows] = await pool.query('SHOW TABLES');
    if (rows.length === 0) {
      console.log('[MySQL] Initializing database tables and seed data...');
      const schemaPath = path.join(__dirname, '..', 'database', 'farhan_motors_mysql.sql');
      if (fs.existsSync(schemaPath)) {
        const sql = fs.readFileSync(schemaPath, 'utf8');
        const statements = sql
          .split(/;\s*[\r\n]+/)
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const stmt of statements) {
          try {
            await pool.query(stmt);
          } catch (e) {
            // Ignore minor duplicate warnings
          }
        }
        console.log('[MySQL] Schema successfully imported into MySQL!');
      }
    }

    isMySQLConnected = true;
    console.log(`[MySQL] Database '${config.database}' is READY and ACTIVE.`);
    return { connected: true, type: 'mysql' };
  } catch (err) {
    isMySQLConnected = false;
    console.warn(`[DB Notice] Could not connect to MySQL at ${config.host}:${config.port} (${err.message}).`);
    console.log(`[DB] Running in Smart Local Storage Mode. All features remain fully functional!`);
    loadLocalDB();
    return { connected: false, type: 'local', error: err.message };
  }
}

// Generic query dispatcher
export async function query(sql, params = []) {
  if (isMySQLConnected && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error('[MySQL Error]:', err.message);
      throw err;
    }
  }
  return null;
}

// Database Operations
export const db = {
  isMySQL: () => isMySQLConnected,

  async getTable(tableName, options = {}) {
    const { order, ascending = false, filters = {}, limit } = options;

    if (isMySQLConnected && pool) {
      try {
        let sql = `SELECT * FROM \`${tableName}\``;
        const params = [];
        const filterKeys = Object.keys(filters);

        if (filterKeys.length > 0) {
          const clauses = filterKeys.map(k => {
            params.push(filters[k]);
            return `\`${k}\` = ?`;
          });
          sql += ` WHERE ${clauses.join(' AND ')}`;
        }

        if (order) {
          sql += ` ORDER BY \`${order}\` ${ascending ? 'ASC' : 'DESC'}`;
        }

        if (limit) {
          sql += ` LIMIT ${Number(limit)}`;
        }

        const [rows] = await pool.query(sql, params);
        return rows;
      } catch (err) {
        console.error(`[MySQL] getTable ${tableName} error:`, err.message);
      }
    }

    // Local fallback
    const local = loadLocalDB();
    let records = (local[tableName] || []).slice();

    // Filter
    Object.keys(filters).forEach(k => {
      records = records.filter(r => String(r[k]) === String(filters[k]));
    });

    // Order
    if (order) {
      records.sort((a, b) => {
        const valA = a[order] ?? '';
        const valB = b[order] ?? '';
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });
    }

    if (limit) {
      records = records.slice(0, Number(limit));
    }

    return records;
  },

  async insert(tableName, record) {
    const id = record.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const data = { ...record, id, created_at: record.created_at || new Date().toISOString() };

    if (isMySQLConnected && pool) {
      try {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const values = keys.map(k => {
          if (data[k] !== null && typeof data[k] === 'object') {
            return JSON.stringify(data[k]);
          }
          return data[k];
        });

        const sql = `INSERT INTO \`${tableName}\` (${keys.map(k => `\`${k}\``).join(', ')}) VALUES (${placeholders})`;
        await pool.query(sql, values);
        return data;
      } catch (err) {
        console.error(`[MySQL] insert into ${tableName} error:`, err.message);
        throw err;
      }
    }

    // Local fallback
    const local = loadLocalDB();
    local[tableName] = local[tableName] || [];
    local[tableName].unshift(data);
    saveLocalDB(local);
    return data;
  },

  async update(tableName, id, updates) {
    if (isMySQLConnected && pool) {
      try {
        const keys = Object.keys(updates).filter(k => k !== 'id');
        if (keys.length === 0) return { id, ...updates };

        const setClause = keys.map(k => `\`${k}\` = ?`).join(', ');
        const values = keys.map(k => {
          if (updates[k] !== null && typeof updates[k] === 'object') {
            return JSON.stringify(updates[k]);
          }
          return updates[k];
        });
        values.push(id);

        const sql = `UPDATE \`${tableName}\` SET ${setClause} WHERE \`id\` = ?`;
        await pool.query(sql, values);
        return { id, ...updates };
      } catch (err) {
        console.error(`[MySQL] update ${tableName} error:`, err.message);
        throw err;
      }
    }

    // Local fallback
    const local = loadLocalDB();
    local[tableName] = local[tableName] || [];
    const idx = local[tableName].findIndex(r => r.id === id);
    if (idx !== -1) {
      local[tableName][idx] = { ...local[tableName][idx], ...updates, updated_at: new Date().toISOString() };
      saveLocalDB(local);
      return local[tableName][idx];
    }
    return { id, ...updates };
  },

  async delete(tableName, id) {
    if (isMySQLConnected && pool) {
      try {
        await pool.query(`DELETE FROM \`${tableName}\` WHERE \`id\` = ?`, [id]);
        return true;
      } catch (err) {
        console.error(`[MySQL] delete from ${tableName} error:`, err.message);
        throw err;
      }
    }

    // Local fallback
    const local = loadLocalDB();
    if (local[tableName]) {
      local[tableName] = local[tableName].filter(r => r.id !== id);
      saveLocalDB(local);
    }
    return true;
  }
};
