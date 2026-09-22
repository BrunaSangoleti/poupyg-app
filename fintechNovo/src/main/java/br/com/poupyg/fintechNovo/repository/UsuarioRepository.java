package br.com.poupyg.fintechNovo.repository;

import br.com.poupyg.fintechNovo.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, java.util.UUID> {

    Optional<Usuario> findByEmail(String email);
}