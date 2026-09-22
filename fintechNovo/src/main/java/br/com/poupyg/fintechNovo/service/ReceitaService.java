package br.com.poupyg.fintechNovo.service;

import br.com.poupyg.fintechNovo.exception.RecursoNaoEncontradoException;
import br.com.poupyg.fintechNovo.model.Receita;


import br.com.poupyg.fintechNovo.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReceitaService {

    @Autowired
    private ReceitaRepository receitaRepository;

    public Receita buscarReceita(java.util.UUID id) {
        Optional<Receita> receita = receitaRepository.findById(id);

        if(receita.isPresent()) {
            return receita.get();
        } else {
            throw new RecursoNaoEncontradoException("Receita com o ID " + id + " não foi encontrada.");
        }
    }


    public List<Receita> buscarTodos() {
        return receitaRepository.findAll();
    }


    public List<Receita> buscarPorUsuario(java.util.UUID usuarioId) {

        return receitaRepository.findByUsuarioCodigo(usuarioId);
    }

    public Receita salvar(Receita receita) {
        return receitaRepository.save(receita);
    }

    public void excluir(java.util.UUID id) {
        Optional<Receita> receita = receitaRepository.findById(id);

        if(receita.isPresent()) {
            receitaRepository.deleteById(id);
        } else {
            throw new RecursoNaoEncontradoException("Não foi possível excluir. Receita com o ID " + id + " não encontrada.");
        }
    }

    public Receita atualizar(java.util.UUID id, Receita receitaAtualizada) {
        Optional<Receita> receitaAtual = receitaRepository.findById(id);

        if(receitaAtual.isPresent()) {
            Receita receitaExistente = receitaAtual.get();

            receitaExistente.setDescricao(receitaAtualizada.getDescricao());
            receitaExistente.setValor(receitaAtualizada.getValor());
            receitaExistente.setData(receitaAtualizada.getData());
            receitaExistente.setCategoria(receitaAtualizada.getCategoria());

            return receitaRepository.save(receitaExistente);
        } else {
            throw new RecursoNaoEncontradoException("Não foi possível atualizar. Receita com o ID " + id + " não encontrada.");
        }
    }
}