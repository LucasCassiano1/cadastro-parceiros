-- create_schema.sql
CREATE DATABASE IF NOT EXISTS ParceirosDB;
GO
USE ParceirosDB;
GO

CREATE TABLE IF NOT EXISTS dbo.Parceiros (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Personalidade NVARCHAR(20) NOT NULL,
    RazaoSocial NVARCHAR(200) NOT NULL,
    Documento NVARCHAR(50) NOT NULL UNIQUE,
    CEP NVARCHAR(10) NOT NULL,
    UF NVARCHAR(2) NOT NULL,
    Municipio NVARCHAR(150) NOT NULL,
    Logradouro NVARCHAR(300) NOT NULL,
    Numero NVARCHAR(50),
    Bairro NVARCHAR(150),
    Email NVARCHAR(254),
    Telefone NVARCHAR(50),
    Complemento NVARCHAR(200),
    Observacao NVARCHAR(MAX),
    DataCriacao DATETIME DEFAULT GETDATE()
);
GO

CREATE OR ALTER PROCEDURE dbo.sp_inserir_parceiro
    @personalidade NVARCHAR(20),
    @razaoSocial NVARCHAR(200),
    @documento NVARCHAR(50),
    @cep NVARCHAR(10),
    @uf NVARCHAR(2),
    @municipio NVARCHAR(150),
    @logradouro NVARCHAR(300),
    @numero NVARCHAR(50),
    @bairro NVARCHAR(150),
    @email NVARCHAR(254),
    @telefone NVARCHAR(50),
    @complemento NVARCHAR(200) = NULL,
    @observacao NVARCHAR(MAX) = NULL,
    @InsertedId INT OUTPUT,
    @Message NVARCHAR(4000) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM dbo.Parceiros WHERE Documento = @documento)
        BEGIN
            SET @InsertedId = NULL;
            SET @Message = 'Documento já cadastrado';
            RETURN;
        END

        INSERT INTO dbo.Parceiros
           (Personalidade, RazaoSocial, Documento, CEP, UF, Municipio, Logradouro, Numero, Bairro, Email, Telefone, Complemento, Observacao)
        VALUES
           (@personalidade, @razaoSocial, @documento, @cep, @uf, @municipio, @logradouro, @numero, @bairro, @email, @telefone, @complemento, @observacao);

        SET @InsertedId = SCOPE_IDENTITY();
        SET @Message = 'Parceiro inserido com sucesso';
    END TRY
    BEGIN CATCH
        SET @InsertedId = NULL;
        SET @Message = ERROR_MESSAGE();
    END CATCH
END;
GO
