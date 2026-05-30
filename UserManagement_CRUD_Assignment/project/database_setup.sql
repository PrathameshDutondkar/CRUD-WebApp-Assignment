-- ============================================================
-- User Management System — SQL Server Setup Script
-- Run this in SQL Server Management Studio (SSMS) or Azure Data Studio
-- if you want to create the database manually instead of using EF migrations
-- ============================================================

-- 1. Create database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'UserManagementDB')
BEGIN
    CREATE DATABASE UserManagementDB;
    PRINT 'Database UserManagementDB created.'
END
GO

USE UserManagementDB;
GO

-- 2. Create __EFMigrationsHistory table (required by EF Core)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[__EFMigrationsHistory]') AND type = N'U')
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId]    nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32)  NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
    PRINT '__EFMigrationsHistory table created.'
END
GO

-- 3. Create Users table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type = N'U')
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id]                 INT            IDENTITY(1,1) NOT NULL,
        [FirstName]          NVARCHAR(100)  NOT NULL,
        [LastName]           NVARCHAR(100)  NOT NULL,
        [PhotoPath]          NVARCHAR(500)  NULL,
        [Gender]             NVARCHAR(10)   NOT NULL,
        [Email]              NVARCHAR(200)  NOT NULL,
        [MobileNo]           NVARCHAR(10)   NOT NULL,
        [DateOfBirth]        DATETIME2(7)   NOT NULL,
        [City]               NVARCHAR(100)  NOT NULL,
        [ProfessionalSkills] NVARCHAR(500)  NOT NULL DEFAULT '',
        CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
    PRINT 'Users table created.'
END
GO

-- 4. Insert seed data
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users])
BEGIN
    INSERT INTO [dbo].[Users]
        ([FirstName],[LastName],[PhotoPath],[Gender],[Email],[MobileNo],[DateOfBirth],[City],[ProfessionalSkills])
    VALUES
        ('Rajesh','Sharma',  NULL, 'Male',   'rajesh.sharma@example.com',  '9876543210', '1995-06-15', 'Pune',   'Communication,Problem Solving'),
        ('Priya', 'Patel',   NULL, 'Female', 'priya.patel@example.com',    '9123456780', '1998-03-22', 'Mumbai', 'Communication,Critical Thinking,Initiative');

    PRINT 'Seed data inserted.'
END
GO

-- 5. Mark migration as applied (so EF doesn't try to re-run it)
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20240101000000_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId],[ProductVersion])
    VALUES ('20240101000000_InitialCreate','8.0.0');
    PRINT 'Migration record inserted.'
END
GO

-- 6. Verify
SELECT 'Setup complete!' AS Status;
SELECT * FROM [dbo].[Users];
GO
