-- ========================================
-- CRIAR TABELAS ASP.NET IDENTITY
-- ========================================
-- Script para criar manualmente as tabelas do ASP.NET Identity
-- quando as migrations não podem ser aplicadas

USE AllMoove;
GO

PRINT '🔧 CRIANDO TABELAS ASP.NET IDENTITY';
PRINT '========================================';
PRINT '';

-- ========================================
-- 1. TABELA ASPNETUSERS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUsers]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetUsers] (
        [Id] NVARCHAR(450) NOT NULL,
        [UserName] NVARCHAR(256) NULL,
        [NormalizedUserName] NVARCHAR(256) NULL,
        [Email] NVARCHAR(256) NULL,
        [NormalizedEmail] NVARCHAR(256) NULL,
        [EmailConfirmed] BIT NOT NULL,
        [PasswordHash] NVARCHAR(MAX) NULL,
        [SecurityStamp] NVARCHAR(MAX) NULL,
        [ConcurrencyStamp] NVARCHAR(MAX) NULL,
        [PhoneNumber] NVARCHAR(MAX) NULL,
        [PhoneNumberConfirmed] BIT NOT NULL,
        [TwoFactorEnabled] BIT NOT NULL,
        [LockoutEnd] DATETIMEOFFSET(7) NULL,
        [LockoutEnabled] BIT NOT NULL,
        [AccessFailedCount] INT NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    PRINT '✅ Tabela AspNetUsers criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetUsers já existe';

-- ========================================
-- 2. TABELA ASPNETROLES
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetRoles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetRoles] (
        [Id] NVARCHAR(450) NOT NULL,
        [Name] NVARCHAR(256) NULL,
        [NormalizedName] NVARCHAR(256) NULL,
        [ConcurrencyStamp] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    PRINT '✅ Tabela AspNetRoles criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetRoles já existe';

-- ========================================
-- 3. TABELA ASPNETUSERCLAIMS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserClaims]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetUserClaims] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [UserId] NVARCHAR(450) NOT NULL,
        [ClaimType] NVARCHAR(MAX) NULL,
        [ClaimValue] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId])
            REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    PRINT '✅ Tabela AspNetUserClaims criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetUserClaims já existe';

-- ========================================
-- 4. TABELA ASPNETUSERLOGINS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserLogins]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetUserLogins] (
        [LoginProvider] NVARCHAR(450) NOT NULL,
        [ProviderKey] NVARCHAR(450) NOT NULL,
        [ProviderDisplayName] NVARCHAR(MAX) NULL,
        [UserId] NVARCHAR(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED ([LoginProvider] ASC, [ProviderKey] ASC),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId])
            REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    PRINT '✅ Tabela AspNetUserLogins criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetUserLogins já existe';

-- ========================================
-- 5. TABELA ASPNETUSERROLES
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserRoles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetUserRoles] (
        [UserId] NVARCHAR(450) NOT NULL,
        [RoleId] NVARCHAR(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED ([UserId] ASC, [RoleId] ASC),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId])
            REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId])
            REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    PRINT '✅ Tabela AspNetUserRoles criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetUserRoles já existe';

-- ========================================
-- 6. TABELA ASPNETUSERTOKENS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetUserTokens]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetUserTokens] (
        [UserId] NVARCHAR(450) NOT NULL,
        [LoginProvider] NVARCHAR(450) NOT NULL,
        [Name] NVARCHAR(450) NOT NULL,
        [Value] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED ([UserId] ASC, [LoginProvider] ASC, [Name] ASC),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId])
            REFERENCES [dbo].[AspNetUsers] ([Id]) ON DELETE CASCADE
    );
    PRINT '✅ Tabela AspNetUserTokens criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetUserTokens já existe';

-- ========================================
-- 7. TABELA ASPNETROLECLAIMS
-- ========================================
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[AspNetRoleClaims]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[AspNetRoleClaims] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [RoleId] NVARCHAR(450) NOT NULL,
        [ClaimType] NVARCHAR(MAX) NULL,
        [ClaimValue] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED ([Id] ASC),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId])
            REFERENCES [dbo].[AspNetRoles] ([Id]) ON DELETE CASCADE
    );
    PRINT '✅ Tabela AspNetRoleClaims criada';
END
ELSE
    PRINT '⏭️ Tabela AspNetRoleClaims já existe';

-- ========================================
-- 8. CRIAR ÍNDICES
-- ========================================
PRINT '';
PRINT '📋 Criando índices...';

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetRoleClaims_RoleId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_AspNetRoleClaims_RoleId] ON [dbo].[AspNetRoleClaims] ([RoleId]);
    PRINT '✅ Índice IX_AspNetRoleClaims_RoleId criado';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'RoleNameIndex')
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles] ([NormalizedName])
    WHERE [NormalizedName] IS NOT NULL;
    PRINT '✅ Índice RoleNameIndex criado';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetUserClaims_UserId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_AspNetUserClaims_UserId] ON [dbo].[AspNetUserClaims] ([UserId]);
    PRINT '✅ Índice IX_AspNetUserClaims_UserId criado';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetUserLogins_UserId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_AspNetUserLogins_UserId] ON [dbo].[AspNetUserLogins] ([UserId]);
    PRINT '✅ Índice IX_AspNetUserLogins_UserId criado';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AspNetUserRoles_RoleId')
BEGIN
    CREATE NONCLUSTERED INDEX [IX_AspNetUserRoles_RoleId] ON [dbo].[AspNetUserRoles] ([RoleId]);
    PRINT '✅ Índice IX_AspNetUserRoles_RoleId criado';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'EmailIndex')
BEGIN
    CREATE NONCLUSTERED INDEX [EmailIndex] ON [dbo].[AspNetUsers] ([NormalizedEmail]);
    PRINT '✅ Índice EmailIndex criado';
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'UserNameIndex')
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers] ([NormalizedUserName])
    WHERE [NormalizedUserName] IS NOT NULL;
    PRINT '✅ Índice UserNameIndex criado';
END

PRINT '';
PRINT '========================================';
PRINT '✅ TABELAS ASP.NET IDENTITY CRIADAS!';
PRINT '========================================';
PRINT '';
PRINT '📋 Tabelas criadas:';
PRINT '  • AspNetUsers';
PRINT '  • AspNetRoles';
PRINT '  • AspNetUserClaims';
PRINT '  • AspNetUserLogins';
PRINT '  • AspNetUserRoles';
PRINT '  • AspNetUserTokens';
PRINT '  • AspNetRoleClaims';
PRINT '';
PRINT '🎯 PRÓXIMO PASSO:';
PRINT 'Execute este script no SQL Server Management Studio';
PRINT 'ou via sqlcmd:';
PRINT '';
PRINT 'sqlcmd -S localhost -i criar-aspnet-identity-tables.sql';
PRINT '';
