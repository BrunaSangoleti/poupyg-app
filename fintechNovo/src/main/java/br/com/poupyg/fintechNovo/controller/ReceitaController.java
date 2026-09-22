package br.com.poupyg.fintechNovo.controller;

import br.com.poupyg.fintechNovo.model.Receita;
import br.com.poupyg.fintechNovo.service.ReceitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/receita")

public class ReceitaController {

    @Autowired
    private ReceitaService service;

    @GetMapping
    public ResponseEntity<List<br.com.poupyg.fintechNovo.dto.ReceitaResponseDTO>> listar(@org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        List<Receita> receitas = service.buscarPorUsuario(usuarioAutenticado.getCodigo());
        return ResponseEntity.ok(receitas.stream().map(br.com.poupyg.fintechNovo.dto.ReceitaResponseDTO::new).toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public br.com.poupyg.fintechNovo.dto.ReceitaResponseDTO criar(
            @jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.ReceitaRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        Receita receita = new Receita();
        receita.setDescricao(dto.getDescricao());
        receita.setValor(dto.getValor());
        receita.setData(dto.getData() != null ? dto.getData() : java.time.LocalDate.now());
        receita.setCategoria(dto.getCategoria() != null ? dto.getCategoria() : "Outros");
        receita.setUsuario(usuarioAutenticado);
        return new br.com.poupyg.fintechNovo.dto.ReceitaResponseDTO(service.salvar(receita));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable java.util.UUID id, 
            @jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.ReceitaRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        
        br.com.poupyg.fintechNovo.model.Receita receitaExistente = service.buscarReceita(id);
        if (!receitaExistente.getUsuario().getCodigo().equals(usuarioAutenticado.getCodigo())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Você não tem permissão para alterar esta receita.");
        }

        br.com.poupyg.fintechNovo.model.Receita receita = new br.com.poupyg.fintechNovo.model.Receita();
        receita.setDescricao(dto.getDescricao());
        receita.setValor(dto.getValor());
        receita.setUsuario(usuarioAutenticado);
        return ResponseEntity.ok(new br.com.poupyg.fintechNovo.dto.ReceitaResponseDTO(service.atualizar(id, receita)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable java.util.UUID id, 
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) { 
        
        br.com.poupyg.fintechNovo.model.Receita receitaExistente = service.buscarReceita(id);
        if (!receitaExistente.getUsuario().getCodigo().equals(usuarioAutenticado.getCodigo())) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).body("Você não tem permissão para excluir esta receita.");
        }

        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
