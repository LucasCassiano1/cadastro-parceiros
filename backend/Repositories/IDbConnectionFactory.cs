using System.Data;

namespace parceiros_backend.Repositories
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateConnection();
    }
}
