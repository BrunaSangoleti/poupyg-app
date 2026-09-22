package br.com.poupyg.fintechNovo.controller;

import br.com.poupyg.fintechNovo.model.Investimento;
import br.com.poupyg.fintechNovo.service.InvestimentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/investimento")

public class InvestimentoController {

    @Autowired
    private InvestimentoService service;

    @GetMapping
    public ResponseEntity<List<br.com.poupyg.fintechNovo.dto.InvestimentoResponseDTO>> listar(@org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        List<Investimento> investimentos = service.buscarPorUsuario(usuarioAutenticado.getCodigo());
        return ResponseEntity.ok(investimentos.stream().map(br.com.poupyg.fintechNovo.dto.InvestimentoResponseDTO::new).toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public br.com.poupyg.fintechNovo.dto.InvestimentoResponseDTO criar(
            @jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.InvestimentoRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        Investimento inv = new Investimento();
        inv.setDescricao(dto.getDescricao());
        inv.setValor(dto.getValor());
        inv.setData(dto.getData() != null ? dto.getData() : java.time.LocalDate.now());
        inv.setCategoria(dto.getCategoria() != null ? dto.getCategoria() : "Outros");
        inv.setUsuario(usuarioAutenticado);
        return new br.com.poupyg.fintechNovo.dto.InvestimentoResponseDTO(service.salvar(inv));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable java.util.UUID id, 
            @jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.InvestimentoRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        
        br.com.poupyg.fintechNovo.model.Investimento invExistente = service.buscarInvestimento(id);
        if (!invExistente.getUsuario().getCodigo().equals(usuarioAutenticado.getCodigo())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Você não tem permissão para alterar este investimento.");
        }

        br.com.poupyg.fintechNovo.model.Investimento inv = new br.com.poupyg.fintechNovo.model.Investimento();
        inv.setDescricao(dto.getDescricao());
        inv.setValor(dto.getValor());
        inv.setUsuario(usuarioAutenticado);
        return ResponseEntity.ok(new br.com.poupyg.fintechNovo.dto.InvestimentoResponseDTO(service.atualizar(id, inv)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable java.util.UUID id, 
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) { 
        
        br.com.poupyg.fintechNovo.model.Investimento invExistente = service.buscarInvestimento(id);
        if (!invExistente.getUsuario().getCodigo().equals(usuarioAutenticado.getCodigo())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Você não tem permissão para excluir este investimento.");
        }

        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}