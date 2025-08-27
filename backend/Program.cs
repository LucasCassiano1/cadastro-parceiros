using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;
using parceiros_backend.Repositories;

var builder = WebApplication.CreateBuilder(args);

// configuração de CORS (permite o Angular em localhost:4200)
var allowedOrigin = "http://localhost:4200";
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração da connection string disponível via IConfiguration
builder.Services.AddSingleton<IDbConnectionFactory, SqlDbConnectionFactory>();
builder.Services.AddScoped<IParceiroRepository, ParceiroRepository>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// força rodar na porta 3000 (opcional: você pode usar dotnet run --urls)
var urls = app.Configuration["ASPNETCORE_URLS"] ?? "http://localhost:3000";
app.Run(urls);
