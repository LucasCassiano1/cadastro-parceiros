using System.ComponentModel.DataAnnotations;

namespace parceiros_backend.Models
{
    public class Parceiro
    {
        [Required]
        public string Personalidade { get; set; } = null!; // "FISICA" | "JURIDICA"

        [Required]
        public string RazaoSocial { get; set; } = null!;

        [Required]
        public string Documento { get; set; } = null!; // só dígitos

        [Required]
        public string Cep { get; set; } = null!; // só dígitos

        [Required, StringLength(2)]
        public string Uf { get; set; } = null!;

        [Required]
        public string Municipio { get; set; } = null!;

        [Required]
        public string Logradouro { get; set; } = null!;

        [Required]
        public string Numero { get; set; } = null!;

        [Required]
        public string Bairro { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Telefone { get; set; } = null!; // só dígitos

        public string? Complemento { get; set; }
        public string? Observacao { get; set; }
    }
}
