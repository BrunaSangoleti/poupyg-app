package br.com.poupyg.fintechNovo.dto;

import br.com.poupyg.fintechNovo.model.Despesa;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class DespesaResponseDTO {
    private UUID id;
    private String descricao;
    private BigDecimal valor;
    private LocalDate data;
    private String categoria;
    private UUID usuarioId;
    private String nomeUsuario;

    public DespesaResponseDTO() {}

    public DespesaResponseDTO(Despesa despesa) {
        this.id = despesa.getId();
        this.descricao = despesa.getDescricao();
        this.valor = despesa.getValor();
        this.data = despesa.getData();
        this.categoria = despesa.getCategoria();
        if (despesa.getUsuario() != null) {
            this.usuarioId = despesa.getUsuario().getCodigo();
            this.nomeUsuario = despesa.getUsuario().getNome();
        }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

    public String getNomeUsuario() { return nomeUsuario; }
    public void setNomeUsuario(String nomeUsuario) { this.nomeUsuario = nomeUsuario; }
}
