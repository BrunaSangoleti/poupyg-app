package br.com.poupyg.fintechNovo.dto;

public class UsuarioRequestDTO {
    @jakarta.validation.constraints.NotBlank(message = "O e-mail é obrigatório")
    @jakarta.validation.constraints.Email(message = "Formato de e-mail inválido")
    private String email;

    @jakarta.validation.constraints.NotBlank(message = "A senha é obrigatória")
    @jakarta.validation.constraints.Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;

    @jakarta.validation.constraints.NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @jakarta.validation.constraints.NotBlank(message = "O nome é obrigatório")
    private String nome;

    @jakarta.validation.constraints.NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
