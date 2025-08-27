using parceiros_backend.Models;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;

namespace parceiros_backend.Repositories
{
    public class ParceiroRepository : IParceiroRepository
    {
        private readonly IDbConnectionFactory _factory;
        public ParceiroRepository(IDbConnectionFactory factory)
        {
            _factory = factory;
        }

        public async Task<RepositoryResult> InserirParceiroAsync(Parceiro p)
        {
            // Cast explícito para SqlConnection para usar métodos async do provider
            using var conn = (SqlConnection)_factory.CreateConnection();
            await conn.OpenAsync();

            using var cmd = new SqlCommand("sp_inserir_parceiro", conn)
            {
                CommandType = CommandType.StoredProcedure,
                CommandTimeout = 60
            };

            // Parâmetros de entrada
            cmd.Parameters.AddWithValue("@personalidade", p.Personalidade);
            cmd.Parameters.AddWithValue("@razaoSocial", p.RazaoSocial);
            cmd.Parameters.AddWithValue("@documento", p.Documento);
            cmd.Parameters.AddWithValue("@cep", p.Cep);
            cmd.Parameters.AddWithValue("@uf", p.Uf);
            cmd.Parameters.AddWithValue("@municipio", p.Municipio);
            cmd.Parameters.AddWithValue("@logradouro", p.Logradouro);
            cmd.Parameters.AddWithValue("@numero", p.Numero);
            cmd.Parameters.AddWithValue("@bairro", p.Bairro);
            cmd.Parameters.AddWithValue("@email", p.Email);
            cmd.Parameters.AddWithValue("@telefone", p.Telefone);
            cmd.Parameters.AddWithValue("@complemento", (object?)p.Complemento ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@observacao", (object?)p.Observacao ?? DBNull.Value);

            // Parâmetros de saída
            var outId = new SqlParameter("@InsertedId", SqlDbType.Int)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(outId);

            var outMsg = new SqlParameter("@Message", SqlDbType.NVarChar, 4000)
            {
                Direction = ParameterDirection.Output
            };
            cmd.Parameters.Add(outMsg);

            try
            {
                await cmd.ExecuteNonQueryAsync();

                var idObj = outId.Value == DBNull.Value ? null : (int?)Convert.ToInt32(outId.Value);
                var msg = outMsg.Value == DBNull.Value ? string.Empty : (outMsg.Value?.ToString() ?? string.Empty);

                return new RepositoryResult
                {
                    Success = true,
                    InsertedId = idObj,
                    Message = msg
                };
            }
            catch (SqlException ex)
            {
                // Tratamento de duplicidade (códigos 2627 ou 2601)
                if (ex.Number == 2627 || ex.Number == 2601)
                {
                    return new RepositoryResult
                    {
                        Success = false,
                        Message = "Registro duplicado (documento ou outro campo único)."
                    };
                }

                return new RepositoryResult
                {
                    Success = false,
                    Message = $"Erro ao inserir parceiro: {ex.Message}"
                };
            }
            catch (Exception ex)
            {
                return new RepositoryResult
                {
                    Success = false,
                    Message = $"Erro inesperado: {ex.Message}"
                };
            }
        }
    }
}
