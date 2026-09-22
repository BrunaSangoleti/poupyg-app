package br.com.poupyg.fintechNovo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "T_USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_usuario", nullable = false)
    private java.util.UUID codigo;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @Column(name = "senha", length = 100, nullable = false)
    private String senha;


    @Column(name = "cpf_usuario", length = 15, nullable = false)
    private String cpf;


    @Column(name = "nm_usuario", length = 100, nullable = false)
    private String nome;

    @Column(name = "telefone", length = 15, nullable = false)
    private String telefone;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Despesa> despesa = new ArrayList<>();
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Investimento> investimentos = new ArrayList<>();
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Receita> receita = new ArrayList<>();



    public Usuario() {}

    public Usuario(String email, String senha, String cpf, String nome, String telefone) {

        this.email = email;

        this.senha = senha;

        this.cpf = cpf;


        this.nome = nome;

        this.telefone = telefone;

    }



    public Usuario(java.util.UUID codigo, String email, String senha, String cpf, String nome, String telefone) {

        this.codigo = codigo;

        this.email = email;

        this.senha = senha;

        this.cpf = cpf;



        this.nome = nome;

        this.telefone = telefone;

    }

    public void exibirDados() {

        System.out.println("------------------------------------");

        System.out.println("DADOS DO USUÁRIO:");

        System.out.println("Nome: " + this.nome);

        System.out.println("Telefone: " + this.telefone);

        System.out.println("E-mail: " + this.email);

        System.out.println("CPF: " + this.cpf);

        System.out.println("------------------------------------");

    }







    public java.util.UUID getCodigo() {
        return codigo;
    }

    public void setCodigo(java.util.UUID codigo) {
        this.codigo = codigo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }


    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }




}