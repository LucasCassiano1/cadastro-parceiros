# Cadastro de Parceiros Comerciais
Projeto fullstack: Angular (frontend) + .NET (backend) + SQL Server (banco).

## Estrutura
- `frontend/` — código Angular
- `backend/` — API em .NET
- `banco de dados/script.sql` — script de criação da tabela e procedure
 
## Pré-requisitos 
1. Node.js + npm (Angular CLI) — recomendado Node 16+ 
2. Angular CLI (npm i -g @angular/cli) 
3. NET SDK 6/7 (conforme projeto) 
4. Docker (recomendado para SQL Server) ou SQL Server instalado localmente 
5. Azure Data Studio (ou SQL Server Management Studio) 

## Como rodar 

1. Banco: usar Docker (SQL Server) ou Azure Data Studio + criar DB com `banco/scripts/create_schema.sql`.
2. Backend: abrir `backend/` e rodar `dotnet run`.
3. Frontend: abrir `frontend/` e rodar `ng serve`.

<!-- Failed to upload "video-cadastro-parceiros.mp4" -->****
