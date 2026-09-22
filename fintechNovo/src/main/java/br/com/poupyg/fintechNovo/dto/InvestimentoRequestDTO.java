package br.com.poupyg.fintechNovo.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class InvestimentoRequestDTO {
    @jakarta.validation.constraints.NotBlank(message = "A descrição é obrigatória")
    private String descricao;

    @jakarta.validation.constraints.NotNull(message = "O valor é obrigatório")
    @jakarta.validation.constraints.Positive(message = "O valor deve ser maior que zero")
    private BigDecimal valor;

    private LocalDate data;

    private String categoria;

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}
