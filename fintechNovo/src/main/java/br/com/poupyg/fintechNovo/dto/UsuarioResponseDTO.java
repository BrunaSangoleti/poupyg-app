package br.com.poupyg.fintechNovo.dto;

import br.com.poupyg.fintechNovo.model.Usuario;
import java.util.UUID;

public class UsuarioResponseDTO {
    private UUID id;
    private String email;
    private String cpf;
    private String nome;
    private String telefone;

    public UsuarioResponseDTO() {}

    public UsuarioResponseDTO(Usuario usuario) {
        this.id = usuario.getCodigo();
        this.email = usuario.getEmail();
        this.cpf = usuario.getCpf();
        this.nome = usuario.getNome();
        this.telefone = usuario.getTelefone();
    }

    // Getters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
}
