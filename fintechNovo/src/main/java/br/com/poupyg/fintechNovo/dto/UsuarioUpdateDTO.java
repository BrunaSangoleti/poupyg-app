package br.com.poupyg.fintechNovo.dto;

public class UsuarioUpdateDTO {
    @jakarta.validation.constraints.NotBlank(message = "O nome é obrigatório")
    private String nome;

    @jakarta.validation.constraints.NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @jakarta.validation.constraints.NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    // Getters and Setters
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
