package br.com.poupyg.fintechNovo.controller;

import br.com.poupyg.fintechNovo.model.Despesa;
import  br.com.poupyg.fintechNovo.service.DespesaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/despesa")

public class DespesasController {

    @Autowired
    private DespesaService service;

    @GetMapping
    public ResponseEntity<List<br.com.poupyg.fintechNovo.dto.DespesaResponseDTO>> listar(@org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        List<Despesa> despesas = service.buscarPorUsuario(usuarioAutenticado.getCodigo());
        return ResponseEntity.ok(despesas.stream().map(br.com.poupyg.fintechNovo.dto.DespesaResponseDTO::new).toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public br.com.poupyg.fintechNovo.dto.DespesaResponseDTO criar(
            @jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.DespesaRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) { 
        Despesa despesa = new Despesa();
        despesa.setDescricao(dto.getDescricao());
        despesa.setValor(dto.getValor());
        despesa.setData(dto.getData() != null ? dto.getData() : java.time.LocalDate.now());
        despesa.setCategoria(dto.getCategoria() != null ? dto.getCategoria() : "Outros");
        despesa.setUsuario(usuarioAutenticado);
        return new br.com.poupyg.fintechNovo.dto.DespesaResponseDTO(service.salvar(despesa));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @PathVariable java.util.UUID id, 
            @jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.DespesaRequestDTO dto,
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) {
        
        Despesa despesaExistente = service.buscarDespesas(id);
        if (!despesaExistente.getUsuario().getCodigo().equals(usuarioAutenticado.getCodigo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para alterar esta despesa.");
        }

        Despesa despesa = new Despesa();
        despesa.setDescricao(dto.getDescricao());
        despesa.setValor(dto.getValor());
        despesa.setUsuario(usuarioAutenticado); // Keep the ownership
        return ResponseEntity.ok(new br.com.poupyg.fintechNovo.dto.DespesaResponseDTO(service.atualizar(id, despesa)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(
            @PathVariable java.util.UUID id, 
            @org.springframework.security.core.annotation.AuthenticationPrincipal br.com.poupyg.fintechNovo.model.Usuario usuarioAutenticado) { 
        
        Despesa despesaExistente = service.buscarDespesas(id);
        if (!despesaExistente.getUsuario().getCodigo().equals(usuarioAutenticado.getCodigo())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Você não tem permissão para excluir esta despesa.");
        }

        service.excluir(id); 
        return ResponseEntity.noContent().build();
    }
}

