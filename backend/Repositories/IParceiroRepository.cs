using parceiros_backend.Models;
using System.Threading.Tasks;

namespace parceiros_backend.Repositories
{
    public interface IParceiroRepository
    {
        Task<RepositoryResult> InserirParceiroAsync(Parceiro p);
    }

    public class RepositoryResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int? InsertedId { get; set; }
    }
}
