package br.com.poupyg.fintechNovo.repository;

import br.com.poupyg.fintechNovo.model.Despesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DespesaRepository extends JpaRepository<Despesa, java.util.UUID> {
    List<Despesa> findByUsuarioCodigo(java.util.UUID usuarioCodigo);
}