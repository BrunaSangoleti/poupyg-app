package br.com.poupyg.fintechNovo.service;

import br.com.poupyg.fintechNovo.exception.RecursoNaoEncontradoException;
import br.com.poupyg.fintechNovo.model.Usuario;

import br.com.poupyg.fintechNovo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario autenticar(String email, String senha) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            if (passwordEncoder.matches(senha, usuarioOpt.get().getSenha())) {
                return usuarioOpt.get();
            }
        }
        return null;
    }


    public Usuario buscarUsuario(java.util.UUID id) {

        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if(usuario.isPresent()) {
            return usuario.get();
        } else {
            throw new RecursoNaoEncontradoException("Usuario com o ID " + id + " não foi encontrada.");
        }
    }

    public List<Usuario> buscarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario salvar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public void excluir(java.util.UUID id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);

        if(usuario.isPresent()) {
            usuarioRepository.deleteById(id);
        } else {
            throw new RecursoNaoEncontradoException("Não foi possível excluir. Usuário com o ID " + id + " não encontrada.");
        }
    }

    public Usuario atualizar(java.util.UUID id, Usuario usuario) {
        Optional<Usuario> usuarioAtual = usuarioRepository.findById(id);

        if(usuarioAtual.isPresent()) {
            Usuario existente = usuarioAtual.get();
            existente.setNome(usuario.getNome());
            existente.setCpf(usuario.getCpf());
            existente.setTelefone(usuario.getTelefone());
            
            return usuarioRepository.save(existente);
        } else {
            throw new RecursoNaoEncontradoException("Não foi possível atualizar. Usuário com o ID " + id + " não encontrada.");
        }
    }
}