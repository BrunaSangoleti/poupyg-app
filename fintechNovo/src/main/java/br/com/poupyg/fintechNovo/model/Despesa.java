package br.com.poupyg.fintechNovo.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_despesa")
public class Despesa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_despesa")
    private java.util.UUID id;

    @Column(name = "ds_despesa")
    private String descricao;

    @Column(name = "vl_despesa")
    private BigDecimal valor;

    @Column(name = "dt_despesa")
    private LocalDate data;

    @Column(name = "ds_categoria")
    private String categoria;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    public Despesa() {}

    public Despesa(java.util.UUID id, String descricao, BigDecimal valor, LocalDate data, String categoria, Usuario usuario) {
        this.id = id;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
        this.categoria = categoria;
        this.usuario = usuario;
    }

    public java.util.UUID getId() { return id; }
    public void setId(java.util.UUID id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
