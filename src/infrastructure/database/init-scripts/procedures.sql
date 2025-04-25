CREATE PROCEDURE CreateMother
    @username VARCHAR(50),
    @password VARCHAR(255),
    @email VARCHAR(100),
    @due_date DATE,
    @baby_birth_date DATE,
    @notes TEXT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    DECLARE @user_id VARCHAR(36), @role_id VARCHAR(36);

    -- Insertar usuario
    INSERT INTO users (username, password, email)
    VALUES (@username, @password, @email);
    
    SET @user_id = (SELECT id FROM users WHERE username = @username);

    -- Obtener ID del rol 'mother'
    SELECT @role_id = id FROM roles WHERE name = 'mother';

    -- Asignar rol
    INSERT INTO user_roles (user_id, role_id)
    VALUES (@user_id, @role_id);

    -- Crear perfil de madre
    INSERT INTO mothers_profiles (user_id, due_date, baby_birth_date, notes)
    VALUES (@user_id, @due_date, @baby_birth_date, @notes);

    COMMIT TRANSACTION;
END;




CREATE PROCEDURE GetAllMothers
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.id,
        u.username,
        u.email,
        u.isActive,
        u.lastLogin,
        mp.due_date,
        mp.baby_birth_date,
        mp.notes
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    INNER JOIN roles r ON ur.role_id = r.id
    LEFT JOIN mothers_profiles mp ON u.id = mp.user_id
    WHERE r.name = 'mother';
END;




CREATE PROCEDURE UpdateMother
    @user_id VARCHAR(36),
    @username VARCHAR(50) = NULL,
    @email VARCHAR(100) = NULL,
    @due_date DATE = NULL,
    @baby_birth_date DATE = NULL,
    @notes TEXT = NULL,
    @isActive BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    -- Actualizar usuario
    UPDATE users SET
        username = ISNULL(@username, username),
        email = ISNULL(@email, email),
        isActive = ISNULL(@isActive, isActive)
    WHERE id = @user_id;
    
    -- Actualizar perfil
    UPDATE mothers_profiles SET
        due_date = ISNULL(@due_date, due_date),
        baby_birth_date = ISNULL(@baby_birth_date, baby_birth_date),
        notes = ISNULL(@notes, notes)
    WHERE user_id = @user_id;
    
    COMMIT TRANSACTION;
END;


CREATE PROCEDURE DeleteMother
    @user_id VARCHAR(36)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    DELETE FROM users WHERE id = @user_id;
    
    COMMIT TRANSACTION;
END;



CREATE PROCEDURE GetMotherById
    @user_id VARCHAR(36)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        u.id,
        u.username,
        u.email,
        u.isActive,
        u.lastLogin,
        mp.due_date,
        mp.baby_birth_date,
        mp.notes
    FROM users u
    LEFT JOIN mothers_profiles mp ON u.id = mp.user_id
    WHERE u.id = @user_id;
END;