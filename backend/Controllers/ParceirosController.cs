using Microsoft.AspNetCore.Mvc;
using parceiros_backend.Helpers;
using parceiros_backend.Models;
using parceiros_backend.Repositories;

namespace parceiros_backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ParceirosController : ControllerBase
    {
        private readonly IParceiroRepository _repo;
        private readonly ILogger<ParceirosController> _logger;

        public ParceirosController(IParceiroRepository repo, ILogger<ParceirosController> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Parceiro parceiro)
        {
            if (!ModelState.IsValid)
            {
                // coleta mensagens de validação
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var msg = string.Join(" | ", errors);
                return BadRequest(ApiResponse<string>.Fail($"Erro de validação: {msg}"));
            }

            try
            {
                var result = await _repo.InserirParceiroAsync(parceiro);
                if (!result.Success)
                {
                    // Ex.: duplicidade
                    return Conflict(ApiResponse<string>.Fail(result.Message));
                }

                // sucesso
                return Ok(ApiResponse<object>.Ok(new { id = result.InsertedId }, result.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar POST /parceiros");
                return StatusCode(500, ApiResponse<string>.Fail("Erro no servidor. Tente novamente mais tarde."));
            }
        }
    }
}
