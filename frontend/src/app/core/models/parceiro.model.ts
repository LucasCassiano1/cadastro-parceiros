export type Personalidade = 'FISICA' | 'JURIDICA';


export interface Parceiro {
personalidade: Personalidade; // Física ou Jurídica
razaoSocial: string; // Para Física, pode ser o nome completo
documento: string; // CPF ou CNPJ (somente dígitos ao enviar)
cep: string; // Somente dígitos ao enviar
uf: string; // Ex.: SP
municipio: string; // Cidade
logradouro: string; // Rua/Avenida
numero: string; // Número
bairro: string; // Bairro
email: string; // E-mail
telefone: string; // Telefone (somente dígitos ao enviar)
complemento: string; // Complemento
observacao: string; // Observação
}