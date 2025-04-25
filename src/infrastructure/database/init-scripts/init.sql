-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        isActive BIT NOT NULL DEFAULT 1,
        lastLogin DATETIME NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
    );
END

-- Create Tokens table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Tokens')
BEGIN
    CREATE TABLE Tokens (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        accessToken VARCHAR(1000) NOT NULL,
        refreshToken VARCHAR(1000) NOT NULL,
        expiresAt DATETIME NOT NULL,
        createdAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    );
END

-- Create index on userId in Tokens table
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Tokens_UserId')
BEGIN
    CREATE INDEX IX_Tokens_UserId ON Tokens(userId);
END


-- Crear el login
CREATE LOGIN auth_login 
WITH PASSWORD = 'AVTH$3CVRITY';

-- Usar la base de datos AUTH
USE aamp_auth;

-- Crear un usuario en la base de datos AUTH para el login creado
CREATE USER admin_auth FOR LOGIN auth_login;

-- Asignar un rol al usuario, por ejemplo, db_owner (si deseas permisos completos en la base de datos)
ALTER ROLE db_owner ADD MEMBER admin_auth;


-- Tabla de Roles
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT CONVERT(VARCHAR(36), NEWID()),
    name VARCHAR(20) UNIQUE NOT NULL -- 'mother', 'admin'
);

-- Tabla de Asignación de Roles
CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Tabla de Perfil de Madres
CREATE TABLE mothers_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT CONVERT(VARCHAR(36), NEWID()),
    user_id VARCHAR(36) UNIQUE NOT NULL,
    due_date DATE NULL,
    baby_birth_date DATE NULL,
    notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de Perfil de Administradores
CREATE TABLE admin_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT CONVERT(VARCHAR(36), NEWID()),
    user_id VARCHAR(36) UNIQUE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE conversations (
    id VARCHAR(36) PRIMARY KEY DEFAULT CONVERT(VARCHAR(36), NEWID()),
    user_id VARCHAR(36) NOT NULL,
    started_at DATETIME NOT NULL DEFAULT GETDATE(),
    ended_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT CONVERT(VARCHAR(36), NEWID()),
    conversation_id VARCHAR(36) NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'ai')),
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

ALTER TABLE mothers_profiles
ADD weight DECIMAL(5,2) NULL,         -- Peso actual (kg o lbs)
    height DECIMAL(5,2) NULL,         -- Altura
    blood_type VARCHAR(3) NULL,       -- Tipo de sangre
    allergies TEXT NULL,              -- Alergias
    medical_history TEXT NULL,
    fecha_nacimiento DATE NULL,
    semanas_gestacion INT NULL,
    numero_de_hijos INT DEFAULT 0,
    tipo_embarazo VARCHAR(50) NULL,        -- Ej: normal, múltiple, alto riesgo
    plan_parto VARCHAR(50) NULL, 
    fecha_ultimo_control DATE NULL,
    mother_concept TEXT NULL, -- Concepto de la madre para chatgpt









