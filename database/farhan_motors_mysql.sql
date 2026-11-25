-- ==============================================================
-- Farhan Motors & Rent A Car (Private) Limited
-- Complete MySQL Database Schema & Initial Data Migration
-- Target Database: u168718068_farhanmotors
-- ==============================================================

-- -------------------------------------------------------------
-- 1. USERS & AUTHENTICATION
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `pin` VARCHAR(10) DEFAULT '4457',
  `full_name` VARCHAR(191) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `profiles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `username` VARCHAR(191) UNIQUE,
  `full_name` VARCHAR(191),
  `contact` VARCHAR(50),
  `cnic` VARCHAR(50),
  `avatar_url` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64) NOT NULL,
  `role` ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_role` (`user_id`, `role`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 2. CUSTOMERS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `cnic` VARCHAR(50),
  `phone` VARCHAR(50),
  `email` VARCHAR(191),
  `address` TEXT,
  `notes` TEXT,
  `created_by` VARCHAR(64),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 3. INVESTORS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `investors` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(191) NOT NULL,
  `cnic` VARCHAR(50),
  `phone` VARCHAR(50),
  `email` VARCHAR(191),
  `arrangement` VARCHAR(50) NOT NULL DEFAULT 'fixed',
  `monthly_amount` DECIMAL(15,2) DEFAULT 0,
  `percentage` DECIMAL(6,2) DEFAULT 0,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 4. VEHICLES (INVENTORY & FLEET)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` VARCHAR(64) PRIMARY KEY,
  `registration_no` VARCHAR(50) NOT NULL UNIQUE,
  `make` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100),
  `variant` VARCHAR(100),
  `year` INT,
  `color` VARCHAR(50),
  `chassis_no` VARCHAR(100),
  `engine_no` VARCHAR(100),
  `engine_capacity` VARCHAR(50),
  `transmission` VARCHAR(50) DEFAULT 'Automatic',
  `fuel_type` VARCHAR(50) DEFAULT 'Petrol',
  `body_type` VARCHAR(50),
  `mileage` INT DEFAULT 0,
  `condition_type` VARCHAR(50) DEFAULT 'Used',
  `purpose` VARCHAR(50) NOT NULL DEFAULT 'sale', -- sale | rent | both
  `status` VARCHAR(50) NOT NULL DEFAULT 'in_stock', -- in_stock | sold | rented | maintenance | reserved
  `ownership_type` VARCHAR(50) DEFAULT 'company',
  `owner_name` VARCHAR(191),
  `owner_cnic` VARCHAR(50),
  `owner_phone` VARCHAR(50),
  `registered_city` VARCHAR(100),
  `token_validity` DATE,
  `fitness_expiry` DATE,
  `insurance_expiry` DATE,
  `purchase_price` DECIMAL(15,2) DEFAULT 0,
  `sale_price` DECIMAL(15,2) DEFAULT 0,
  `rent_per_day` DECIMAL(15,2) DEFAULT 0,
  `rent_per_month` DECIMAL(15,2) DEFAULT 0,
  `rent_with_driver` DECIMAL(15,2) DEFAULT 0,
  `investor_id` VARCHAR(64),
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`investor_id`) REFERENCES `investors`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 5. PURCHASES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `purchases` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64),
  `seller_name` VARCHAR(191) NOT NULL,
  `seller_cnic` VARCHAR(50),
  `seller_phone` VARCHAR(50),
  `amount` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `source` VARCHAR(50) DEFAULT 'local',
  `payment_method` VARCHAR(50) DEFAULT 'cash',
  `status` VARCHAR(50) DEFAULT 'completed',
  `purchase_date` DATE NOT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 6. SALES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `sales` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64),
  `customer_id` VARCHAR(64),
  `amount` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `payment_method` VARCHAR(50) DEFAULT 'cash',
  `status` VARCHAR(50) DEFAULT 'completed',
  `sale_date` DATE NOT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 7. RENTALS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rentals` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64),
  `customer_id` VARCHAR(64),
  `rate` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `rate_type` VARCHAR(50) DEFAULT 'daily',
  `total` DECIMAL(15,2) DEFAULT 0,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` VARCHAR(50) DEFAULT 'active',
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 8. BANK ACCOUNTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bank_accounts` (
  `id` VARCHAR(64) PRIMARY KEY,
  `bank_name` VARCHAR(191) NOT NULL,
  `account_title` VARCHAR(191) NOT NULL,
  `account_number` VARCHAR(100) NOT NULL,
  `iban` VARCHAR(100),
  `branch` VARCHAR(191),
  `type` VARCHAR(50) DEFAULT 'bank',
  `current_balance` DECIMAL(15,2) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 9. FINANCIAL ENTRIES (LEDGER)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `financial_entries` (
  `id` VARCHAR(64) PRIMARY KEY,
  `type` VARCHAR(20) NOT NULL, -- credit | debit
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `description` TEXT,
  `reference_type` VARCHAR(50),
  `reference_id` VARCHAR(64),
  `bank_account_id` VARCHAR(64),
  `entry_date` DATE NOT NULL,
  `created_by` VARCHAR(64),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`bank_account_id`) REFERENCES `bank_accounts`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 10. INVOICES
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` VARCHAR(64) PRIMARY KEY,
  `invoice_no` VARCHAR(100) NOT NULL UNIQUE,
  `type` VARCHAR(50) NOT NULL DEFAULT 'sale',
  `customer_id` VARCHAR(64),
  `reference_id` VARCHAR(64),
  `amount` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(15,2) DEFAULT 0,
  `total` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'unpaid',
  `issue_date` DATE NOT NULL,
  `due_date` DATE,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 11. PAYMENTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(64) PRIMARY KEY,
  `invoice_id` VARCHAR(64),
  `customer_id` VARCHAR(64),
  `amount` DECIMAL(15,2) NOT NULL,
  `method` VARCHAR(50) DEFAULT 'cash',
  `reference` VARCHAR(191),
  `payment_date` DATE NOT NULL,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 12. STAFF & HR
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `staff` (
  `id` VARCHAR(64) PRIMARY KEY,
  `full_name` VARCHAR(191) NOT NULL,
  `cnic` VARCHAR(50),
  `phone` VARCHAR(50),
  `designation` VARCHAR(100),
  `department` VARCHAR(100),
  `salary` DECIMAL(15,2) DEFAULT 0,
  `join_date` DATE,
  `status` VARCHAR(50) DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `attendance` (
  `id` VARCHAR(64) PRIMARY KEY,
  `staff_id` VARCHAR(64) NOT NULL,
  `attendance_date` DATE NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'present',
  `check_in` TIME,
  `check_out` TIME,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_staff_attendance` (`staff_id`, `attendance_date`),
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `payroll` (
  `id` VARCHAR(64) PRIMARY KEY,
  `staff_id` VARCHAR(64) NOT NULL,
  `month` VARCHAR(20) NOT NULL,
  `basic` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `allowances` DECIMAL(15,2) DEFAULT 0,
  `deductions` DECIMAL(15,2) DEFAULT 0,
  `net_pay` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'pending',
  `paid_on` DATE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 13. COMPLAINTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `complaints` (
  `id` VARCHAR(64) PRIMARY KEY,
  `customer_id` VARCHAR(64),
  `subject` VARCHAR(191) NOT NULL,
  `description` TEXT,
  `priority` VARCHAR(50) DEFAULT 'medium',
  `status` VARCHAR(50) DEFAULT 'open',
  `assigned_to` VARCHAR(64),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 14. MAINTENANCE RECORDS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `maintenance_records` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64) NOT NULL,
  `service_type` VARCHAR(191) NOT NULL,
  `cost` DECIMAL(15,2) DEFAULT 0,
  `service_date` DATE NOT NULL,
  `next_service_date` DATE,
  `vendor` VARCHAR(191),
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 15. INSPECTIONS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `inspections` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64) NOT NULL,
  `inspector` VARCHAR(191),
  `inspection_date` DATE NOT NULL,
  `result` VARCHAR(50) DEFAULT 'pending',
  `rating` INT DEFAULT 5,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 16. IMPORTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `imports` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64),
  `vessel` VARCHAR(191),
  `origin` VARCHAR(100),
  `bl_no` VARCHAR(100),
  `cost` DECIMAL(15,2) DEFAULT 0,
  `duty` DECIMAL(15,2) DEFAULT 0,
  `shipment_date` DATE,
  `arrival_date` DATE,
  `status` VARCHAR(50) DEFAULT 'in_transit',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 17. FINANCE PLANS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `finance_plans` (
  `id` VARCHAR(64) PRIMARY KEY,
  `customer_id` VARCHAR(64),
  `vehicle_id` VARCHAR(64),
  `total_amount` DECIMAL(15,2) NOT NULL,
  `down_payment` DECIMAL(15,2) DEFAULT 0,
  `monthly_installment` DECIMAL(15,2) NOT NULL,
  `tenure_months` INT NOT NULL,
  `interest_rate` DECIMAL(5,2) DEFAULT 0,
  `start_date` DATE NOT NULL,
  `status` VARCHAR(50) DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 18. VEHICLE MOVEMENTS (GATE PASS / IN-OUT)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vehicle_movements` (
  `id` VARCHAR(64) PRIMARY KEY,
  `vehicle_id` VARCHAR(64) NOT NULL,
  `movement_type` VARCHAR(20) NOT NULL, -- in | out
  `reason` VARCHAR(191),
  `driver` VARCHAR(191),
  `odometer` INT,
  `movement_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `notes` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 19. ATTACHED DOCUMENTS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `documents` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(191) NOT NULL,
  `category` VARCHAR(100),
  `reference_type` VARCHAR(50),
  `reference_id` VARCHAR(64),
  `file_url` TEXT,
  `file_name` VARCHAR(255),
  `file_size` INT,
  `expiry_date` DATE,
  `notes` TEXT,
  `uploaded_by` VARCHAR(64),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 20. DOCUMENT HISTORY (RECEIPTS & CONTRACT GENERATOR)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `document_history` (
  `id` VARCHAR(64) PRIMARY KEY,
  `kind` VARCHAR(50) NOT NULL,
  `receipt_no` VARCHAR(100),
  `customer_id` VARCHAR(64),
  `customer_name` VARCHAR(191),
  `values` JSON,
  `created_by` VARCHAR(64),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 21. APP SETTINGS & CONFIG
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_settings` (
  `key` VARCHAR(100) PRIMARY KEY,
  `value` JSON NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
-- 22. ACTIVITY LOGS
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64),
  `action` VARCHAR(191) NOT NULL,
  `entity_type` VARCHAR(100),
  `entity_id` VARCHAR(64),
  `details` JSON,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================
-- INITIAL SEED DATA (ZERO DATA LOSS OUT OF THE BOX)
-- ==============================================================

-- 1. Default Administrator User
INSERT INTO `users` (`id`, `email`, `password_hash`, `pin`, `full_name`) VALUES
('usr_admin_001', 'admin@farhanmotors.com', 'admin123', '4457', 'Farhan Ali')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

INSERT INTO `profiles` (`id`, `username`, `full_name`, `contact`, `cnic`) VALUES
('usr_admin_001', 'admin', 'Farhan Ali (Managing Director)', '+923284880257', '38201-1234567-1')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);

INSERT INTO `user_roles` (`id`, `user_id`, `role`) VALUES
('rol_admin_001', 'usr_admin_001', 'admin')
ON DUPLICATE KEY UPDATE `role` = VALUES(`role`);

-- 2. Default Company Settings
INSERT INTO `app_settings` (`key`, `value`) VALUES
('company', '{"name":"Farhan Motors & Rent A Car (Private) Limited","address":"Near Bypass Multan Road, Chowk Azam, Layyah, Punjab, Pakistan","phone":"+923284880257","email":"info@farhanmotors.com"}'),
('preferences', '{"language":"en","currency":"PKR","maintenance_mode":false,"dateFormat":"DD/MM/YYYY"}')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);

-- 3. Initial Bank Accounts
INSERT INTO `bank_accounts` (`id`, `bank_name`, `account_title`, `account_number`, `iban`, `branch`, `type`, `current_balance`, `is_active`) VALUES
('bnk_001', 'Meezan Bank Limited', 'Farhan Motors', '02010101234567', 'PK36MEZN0002010101234567', 'Chowk Azam Branch', 'bank', 4500000.00, 1),
('bnk_002', 'Habib Bank Limited (HBL)', 'Farhan Motors', '12347900112233', 'PK64HABB0012347900112233', 'Layyah Main Branch', 'bank', 2800000.00, 1),
('bnk_003', 'JazzCash Corporate', 'Farhan Motors Merchant', '03284880257', NULL, 'Digital Wallet', 'wallet', 350000.00, 1)
ON DUPLICATE KEY UPDATE `account_title` = VALUES(`account_title`);

-- 4. Initial Customers
INSERT INTO `customers` (`id`, `name`, `cnic`, `phone`, `email`, `address`, `notes`) VALUES
('cst_001', 'Muhammad Ahmed Khan', '38201-7654321-3', '0300-1234567', 'ahmed.khan@gmail.com', 'Ward No 4, Chowk Azam, Layyah', 'Valued regular client'),
('cst_002', 'Sara Ali Chaudhry', '38201-9876543-2', '0321-9876543', 'sara.ali@outlook.com', 'Civil Lines, Layyah', 'Long-term rental customer'),
('cst_003', 'Usman Tariq', '38201-4455667-1', '0333-5566778', 'usman.tariq@yahoo.com', 'Multan Road, Chowk Azam', 'Vehicle purchase client'),
('cst_004', 'Fatima Noor', '38201-1122334-4', '0345-1122334', 'fatima.noor@hotmail.com', 'Housing Colony, Layyah', 'Corporate client')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 5. Initial Vehicles
INSERT INTO `vehicles` (`id`, `registration_no`, `make`, `model`, `variant`, `year`, `color`, `chassis_no`, `engine_no`, `engine_capacity`, `transmission`, `fuel_type`, `body_type`, `mileage`, `purpose`, `status`, `ownership_type`, `owner_name`, `owner_cnic`, `owner_phone`, `registered_city`, `purchase_price`, `sale_price`, `rent_per_day`, `rent_per_month`, `rent_with_driver`) VALUES
('veh_001', 'LEA-24-1234', 'Toyota', 'Corolla', 'Altis Grande 1.8', 2024, 'Pearl White', 'ZRE172-9081234', '2ZR-FE-4567890', '1800cc', 'Automatic', 'Petrol', 'Sedan', 12000, 'both', 'in_stock', 'company', 'Farhan Motors', '38201-1234567-1', '0328-4880257', 'Lahore', 6800000.00, 7250000.00, 8000.00, 190000.00, 11000.00),
('veh_002', 'ICT-23-5678', 'Honda', 'Civic', 'Oriel 1.5 Turbo', 2023, 'Crystal Black', 'FC1-8012345', 'L15B7-1234567', '1500cc', 'Automatic', 'Petrol', 'Sedan', 24000, 'rent', 'rented', 'company', 'Farhan Motors', '38201-1234567-1', '0328-4880257', 'Islamabad', 7500000.00, 0.00, 12000.00, 260000.00, 16000.00),
('veh_003', 'MN-24-9012', 'Suzuki', 'Alto', 'VXR', 2024, 'Solid White', 'HA36S-6789012', 'R06A-8901234', '660cc', 'Manual', 'Petrol', 'Hatchback', 8500, 'sale', 'in_stock', 'company', 'Farhan Motors', '38201-1234567-1', '0328-4880257', 'Multan', 2650000.00, 2900000.00, 0.00, 0.00, 0.00),
('veh_004', 'KHI-23-3456', 'Toyota', 'Hilux', 'Revo Rocco 2.8', 2023, 'Grey Metallic', 'GUN126-7890123', '1GD-FTV-3456789', '2800cc', 'Automatic', 'Diesel', 'Pickup', 35000, 'both', 'in_stock', 'company', 'Farhan Motors', '38201-1234567-1', '0328-4880257', 'Karachi', 14200000.00, 15100000.00, 25000.00, 550000.00, 32000.00),
('veh_005', 'LHR-22-7890', 'Kia', 'Sportage', 'AWD', 2022, 'Panthera Metal', 'QL-5678901', 'G4NC-2345678', '2000cc', 'Automatic', 'Petrol', 'SUV', 41000, 'rent', 'in_stock', 'company', 'Farhan Motors', '38201-1234567-1', '0328-4880257', 'Lahore', 7800000.00, 0.00, 14000.00, 320000.00, 18000.00)
ON DUPLICATE KEY UPDATE `make` = VALUES(`make`);

-- 6. Initial Staff
INSERT INTO `staff` (`id`, `full_name`, `cnic`, `phone`, `designation`, `department`, `salary`, `join_date`, `status`) VALUES
('stf_001', 'Farhan Ali', '38201-1234567-1', '0328-4880257', 'Managing Director', 'Management', 250000.00, '2020-01-01', 'active'),
('stf_002', 'Kamran Yousaf', '38201-2345678-2', '0301-2345678', 'Fleet & Rental Manager', 'Rentals', 95000.00, '2021-03-15', 'active'),
('stf_003', 'Bilal Ahmed', '38201-3456789-3', '0302-3456789', 'Accounts Officer', 'Finance', 85000.00, '2022-06-01', 'active'),
('stf_004', 'Usman Tariq', '38201-4567890-4', '0303-4567890', 'Senior Sales Executive', 'Sales', 75000.00, '2022-09-10', 'active')
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);
