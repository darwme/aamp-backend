/* UpdateMother */
ALTER PROCEDURE [dbo].[UpdateMother]
    @user_id VARCHAR(36),
    @username VARCHAR(50) = NULL,
    @email VARCHAR(100) = NULL,
    @due_date DATE = NULL,
    @baby_birth_date DATE = NULL,
    @notes TEXT = NULL,
    @isActive BIT = NULL,
    -- Nuevos parámetros
    @weight DECIMAL(5,2) = NULL,
    @height DECIMAL(5,2) = NULL,
    @blood_type VARCHAR(3) = NULL,
    @allergies TEXT = NULL,
    @medical_history TEXT = NULL,
    @fecha_nacimiento DATE = NULL,
    @semanas_gestacion INT = NULL,
    @numero_de_hijos INT = NULL,
    @tipo_embarazo VARCHAR(50) = NULL,
    @plan_parto VARCHAR(50) = NULL,
    @fecha_ultimo_control DATE = NULL,
    @mother_concept TEXT = NULL
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
        notes = ISNULL(@notes, notes),
        weight = ISNULL(@weight, weight),
        height = ISNULL(@height, height),
        blood_type = ISNULL(@blood_type, blood_type),
        allergies = ISNULL(@allergies, allergies),
        medical_history = ISNULL(@medical_history, medical_history),
        fecha_nacimiento = ISNULL(@fecha_nacimiento, fecha_nacimiento),
        semanas_gestacion = ISNULL(@semanas_gestacion, semanas_gestacion),
        numero_de_hijos = ISNULL(@numero_de_hijos, numero_de_hijos),
        tipo_embarazo = ISNULL(@tipo_embarazo, tipo_embarazo),
        plan_parto = ISNULL(@plan_parto, plan_parto),
        fecha_ultimo_control = ISNULL(@fecha_ultimo_control, fecha_ultimo_control),
        mother_concept = ISNULL(@mother_concept, mother_concept)
    WHERE user_id = @user_id;
    
    COMMIT TRANSACTION;
END;
GO

/* GetMotherById */
ALTER PROCEDURE [dbo].[GetMotherById]
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
        mp.notes,
        mp.weight,
        mp.height,
        mp.blood_type,
        mp.allergies,
        mp.medical_history,
        mp.fecha_nacimiento,
        mp.semanas_gestacion,
        mp.numero_de_hijos,
        mp.tipo_embarazo,
        mp.plan_parto,
        mp.fecha_ultimo_control,
        mp.mother_concept
    FROM users u
    LEFT JOIN mothers_profiles mp ON u.id = mp.user_id
    WHERE u.id = @user_id;
END;
GO

/* GetAllMothers */
ALTER PROCEDURE [dbo].[GetAllMothers]
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
        mp.notes,
        mp.weight,
        mp.height,
        mp.blood_type,
        mp.allergies,
        mp.medical_history,
        mp.fecha_nacimiento,
        mp.semanas_gestacion,
        mp.numero_de_hijos,
        mp.tipo_embarazo,
        mp.plan_parto,
        mp.fecha_ultimo_control,
        mp.mother_concept
    FROM users u
    INNER JOIN user_roles ur ON u.id = ur.user_id
    INNER JOIN roles r ON ur.role_id = r.id
    LEFT JOIN mothers_profiles mp ON u.id = mp.user_id
    WHERE r.name = 'mother';
END;
GO

/* CreateMother */
ALTER PROCEDURE [dbo].[CreateMother]
    @username VARCHAR(50),
    @password VARCHAR(255),
    @email VARCHAR(100),
    @due_date DATE,
    @baby_birth_date DATE,
    @notes TEXT,
    -- Nuevos parámetros
    @weight DECIMAL(5,2) = NULL,
    @height DECIMAL(5,2) = NULL,
    @blood_type VARCHAR(3) = NULL,
    @allergies TEXT = NULL,
    @medical_history TEXT = NULL,
    @fecha_nacimiento DATE = NULL,
    @semanas_gestacion INT = NULL,
    @numero_de_hijos INT = NULL,
    @tipo_embarazo VARCHAR(50) = NULL,
    @plan_parto VARCHAR(50) = NULL,
    @fecha_ultimo_control DATE = NULL,
    @mother_concept TEXT = NULL,
    @user_id VARCHAR(36) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @role_id VARCHAR(36);

        -- Insertar usuario
        INSERT INTO users (username, password, email)
        VALUES (@username, @password, @email);
        
        -- Obtener el ID del nuevo usuario
        SET @user_id = (SELECT id FROM users WHERE username = @username);

        -- Obtener ID del rol 'mother'
        SELECT @role_id = id FROM roles WHERE name = 'mother';
        
        IF @role_id IS NULL
            THROW 51000, 'El rol "mother" no existe en la tabla roles.', 1;

        -- Asignar rol
        INSERT INTO user_roles (user_id, role_id)
        VALUES (@user_id, @role_id);

        -- Crear perfil de madre
        INSERT INTO mothers_profiles (
            user_id, due_date, baby_birth_date, notes,
            weight, height, blood_type, allergies, medical_history,
            fecha_nacimiento, semanas_gestacion, numero_de_hijos,
            tipo_embarazo, plan_parto, fecha_ultimo_control, mother_concept
        )
        VALUES (
            @user_id, @due_date, @baby_birth_date, @notes,
            @weight, @height, @blood_type, @allergies, @medical_history,
            @fecha_nacimiento, @semanas_gestacion, @numero_de_hijos,
            @tipo_embarazo, @plan_parto, @fecha_ultimo_control, @mother_concept
        );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
