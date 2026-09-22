package br.com.poupyg.fintechNovo.service;

import br.com.poupyg.fintechNovo.exception.RecursoNaoEncontradoException;
import br.com.poupyg.fintechNovo.model.Investimento;

import br.com.poupyg.fintechNovo.repository.InvestimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InvestimentoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;

    public Investimento buscarInvestimento(java.util.UUID id) {

        Optional<Investimento> investimento = investimentoRepository.findById(id);

        if(investimento.isPresent()) {
            return investimento.get();
        } else {
            throw new RecursoNaoEncontradoException("Investimento com o ID " + id + " não foi encontrada.");
        }
    }

    public List<Investimento> buscarTodos() {
        return investimentoRepository.findAll();
    }

    public List<Investimento> buscarPorUsuario(java.util.UUID usuarioId) {
        return investimentoRepository.findByUsuarioCodigo(usuarioId);
    }
    public Investimento salvar(Investimento investimento) {
        return investimentoRepository.save(investimento);
    }

    public void excluir(java.util.UUID id) {
        Optional<Investimento> investimento = investimentoRepository.findById(id);

        if(investimento.isPresent()) {
            investimentoRepository.deleteById(id);
        } else {
            throw new RecursoNaoEncontradoException("Não foi possível excluir. Investimento com o ID " + id + " não encontrada.");
        }
    }

    public Investimento atualizar(java.util.UUID id, Investimento investimentoAtualizado) {
        Optional<Investimento> investimentoAtual = investimentoRepository.findById(id);

        if(investimentoAtual.isPresent()) {
            Investimento investimentoExistente = investimentoAtual.get();

            investimentoExistente.setDescricao(investimentoAtualizado.getDescricao());
            investimentoExistente.setValor(investimentoAtualizado.getValor());
            investimentoExistente.setData(investimentoAtualizado.getData());
            investimentoExistente.setCategoria(investimentoAtualizado.getCategoria());

            return investimentoRepository.save(investimentoExistente);
        } else {
            throw new RecursoNaoEncontradoException("Não foi possível atualizar. Investimento com ID " + id + " não encontrado.");
        }
    }
}
