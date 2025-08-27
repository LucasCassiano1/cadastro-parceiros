using System.Threading.Tasks;
using parceiros_backend.Models;

namespace parceiros_backend.Repositories
{
    public class MockParceiroRepository : IParceiroRepository
    {
        public Task<RepositoryResult> InserirParceiroAsync(Parceiro p)
        {
            // Simula sucesso e id gerado
            var rnd = new System.Random();
            return Task.FromResult(new RepositoryResult
            {
                Success = true,
                InsertedId = rnd.Next(1000, 9999),
                Message = "Inserido (mock)"
            });
        }
    }
}
