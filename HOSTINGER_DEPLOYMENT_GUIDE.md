# Farhan Motors — Hostinger Deployment Guide (مکمل گائیڈ)

یہ مکمل گائیڈ آپ کے سافٹ ویئر کو **Hostinger** پر لائیو چلانے کے لیے تیار کی گئی ہے۔

---

## 🛠 طریقہ کار (2 آسان طریقے)

### طریقہ 1: Hostinger Web / Cloud Hosting (hPanel Node.js)
اگر آپ کے پاس Hostinger کا Business Web Hosting یا Cloud Hosting پیکج ہے:

#### مرحلہ 1: Hostinger پر MySQL Database بنائیں
1. اپنے **Hostinger hPanel** میں لاگ ان کریں۔
2. **Databases** > **MySQL Databases** پر جائیں۔
3. نیا ڈیٹا بیس بنائیں:
   - **Database Name**: مثلاً `farhan_motors` (Hostinger سابقہ جوڑے گا جیسے `u123456789_farhan_motors`)
   - **Username**: مثلاً `u123456789_admin`
   - **Password**: ایک مضبوط پاس ورڈ رکھیں (اسے یاد رکھیں یا محفوظ کریں)
4. **Enter phpMyAdmin** پر کلک کریں۔
5. اوپر دیے گئے مینو سے **Import** پر کلک کریں۔
6. پراجیکٹ میں موجود [`farhan_motors_mysql.sql`](file:///c:/Users/SAS/Desktop/source%20codes/farhanmotors/farhan_motors_mysql.sql) فائل منتخب کریں اور **Go / Import** دبا دیں۔
   *(تمام ٹیبلز اور ابتدائی ڈیٹا امپورٹ ہو جائے گا)*

#### مرحلہ 2: پروجیکٹ بلڈ (Build) کریں
اپنے کمپیوٹر کے ٹرمینل پر یہ کمانڈ چلائیں:
```bash
npm run build
```
اس سے تمام کوڈ `dist` فولڈر میں پروڈکشن ریڈی تیار ہو جائے گا۔

#### مرحلہ 3: فائلیں Hostinger پر اپلوڈ کریں
1. hPanel میں **File Manager** کھولیں۔
2. `public_html` یا اپنے سب ڈومین کے فولڈر میں تمام پروجیکٹ فائلز اپلوڈ کریں (سوائے `node_modules` کے):
   - `dist/`
   - `server/`
   - `database/`
   - `index.js`
   - `package.json`
   - `.env`
3. سرور پر موجود `.env` فائل میں Hostinger کا MySQL کنکشن درج کریں:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=u123456789_admin
   DB_PASSWORD=آپ_کا_ڈیٹابیس_پاسورڈ
   DB_NAME=u123456789_farhan_motors
   ```

#### مرحلہ 4: Hostinger پر Node.js آن کریں
1. hPanel میں سرچ بار میں **Node.js** لکھیں اور اس پر جائیں۔
2. درج ذیل سیٹنگز رکھیں:
   - **Node.js version**: `18.x` یا `20.x`
   - **Application root**: `public_html` (یا جہاں فائلز رکھی ہیں)
   - **Application startup file**: `index.js` (یا `server/server.js`)
3. **Run NPM Install** پر کلک کریں تاکہ مطلوبہ پیکیجز انسٹال ہو جائیں۔
4. **Start Application** پر کلک کریں۔

آپ کی ویب سائٹ اور ڈیٹا بیس لائیو ہو جائیں گے! 🎉

---

### طریقہ 2: Hostinger VPS (Ubuntu / Linux)
اگر آپ نے Hostinger کا VPS لیا ہوا ہے، تو یہ طریقہ سب سے تیز اور محفوظ ہے:

1. **SSH سے لاگ ان کریں:**
   ```bash
   ssh root@YOUR_SERVER_IP
   ```

2. **Node.js & MySQL انسٹال کریں (اگر پہلے سے نہیں ہے):**
   ```bash
   sudo apt update && sudo apt install -y nodejs npm mysql-server git nginx
   sudo npm install -g pm2
   ```

3. **ڈیٹا بیس اور یوزر بنائیں:**
   ```sql
   sudo mysql
   CREATE DATABASE farhan_motors;
   CREATE USER 'farhan_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
   GRANT ALL PRIVILEGES ON farhan_motors.* TO 'farhan_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **اسکیما امپورٹ کریں:**
   ```bash
   mysql -u farhan_user -p farhan_motors < farhan_motors_mysql.sql
   ```

5. **پروجیکٹ رن کریں:**
   ```bash
   npm install --legacy-peer-deps
   npm run build
   pm2 start index.js --name "farhan-motors"
   pm2 startup && pm2 save
   ```

6. **Nginx ریورس پراکسی کنفیگر کریں:**
   `/etc/nginx/sites-available/default` میں:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   اور ری سٹارٹ کریں:
   ```bash
   sudo systemctl restart nginx
   ```

---

### 🔑 ڈیفالٹ لاگ ان کریڈینشلز:
- **Email:** `admin@farhanmotors.com`
- **Password:** `admin123`
- **PIN:** `4457`
