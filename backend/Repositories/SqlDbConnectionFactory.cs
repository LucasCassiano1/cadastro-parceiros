using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;

namespace parceiros_backend.Repositories
{
    public class SqlDbConnectionFactory : IDbConnectionFactory
    {
        private readonly IConfiguration _config;
        public SqlDbConnectionFactory(IConfiguration config)
        {
            _config = config;
        }

        public IDbConnection CreateConnection()
        {
            var cs = _config.GetConnectionString("DefaultConnection");
            // Retornamos SqlConnection, que implementa IDbConnection
            return new SqlConnection(cs);
        }
    }
}
