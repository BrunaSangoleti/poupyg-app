package br.com.poupyg.fintechNovo.controller;



import br.com.poupyg.fintechNovo.model.Usuario;
import br.com.poupyg.fintechNovo.service.UsuarioService;
import br.com.poupyg.fintechNovo.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")

public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> realizarLogin(@RequestBody LoginRequest loginData) { // Usando o DTO aqui
        try {
            String email = loginData.getEmail();
            String senha = loginData.getSenha();

            if (email == null || senha == null || email.isBlank() || senha.isBlank()) {
                return ResponseEntity.badRequest().body("E-mail e senha são obrigatórios.");
            }

            Usuario usuarioAutenticado = usuarioService.autenticar(email, senha);

            if (usuarioAutenticado != null) {
                var token = tokenService.generateToken(usuarioAutenticado);
                Map<String, Object> response = new HashMap<>();
                response.put("id", usuarioAutenticado.getCodigo());
                response.put("nome", usuarioAutenticado.getNome());
                response.put("email", usuarioAutenticado.getEmail());
                response.put("token", token);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha incorretos.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno no servidor ao tentar realizar o login.");
        }
    }

    // Classe DTO auxiliar (pode colocar no final do arquivo do Controller ou em uma classe separada)
    public static class LoginRequest {
        private String email;
        private String senha;

        // Getters e Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    @GetMapping()
    public List<br.com.poupyg.fintechNovo.dto.UsuarioResponseDTO> listar() {
        return usuarioService.buscarTodos().stream()
                .map(br.com.poupyg.fintechNovo.dto.UsuarioResponseDTO::new)
                .toList();
    }


    @GetMapping("/me")
    public ResponseEntity<?> buscarPerfil(@org.springframework.security.core.annotation.AuthenticationPrincipal Usuario usuarioAutenticado) {
        try {
            return ResponseEntity.ok(new br.com.poupyg.fintechNovo.dto.UsuarioResponseDTO(usuarioAutenticado));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro interno ao buscar o perfil do usuário.");
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> atualizar(@jakarta.validation.Valid @RequestBody br.com.poupyg.fintechNovo.dto.UsuarioUpdateDTO dto, @org.springframework.security.core.annotation.AuthenticationPrincipal Usuario usuarioAutenticado) {
        try {
            Usuario usuario = new Usuario();
            usuario.setNome(dto.getNome());
            usuario.setCpf(dto.getCpf());
            usuario.setTelefone(dto.getTelefone());

            Usuario usuarioAtualizado = usuarioService.atualizar(usuarioAutenticado.getCodigo(), usuario);
            if (usuarioAtualizado != null) {
                return ResponseEntity.ok(new br.com.poupyg.fintechNovo.dto.UsuarioResponseDTO(usuarioAtualizado));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado para atualização.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao atualizar usuário.");
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deletar(@org.springframework.security.core.annotation.AuthenticationPrincipal Usuario usuarioAutenticado) {
        try {
            usuarioService.excluir(usuarioAutenticado.getCodigo());
            return ResponseEntity.noContent().build(); // Status 204 No Content
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao deletar usuário.");
        }
    }
}