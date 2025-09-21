package com.biblioteca.biblioteca_digital.service;

import com.biblioteca.biblioteca_digital.model.Emprestimo;
import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.model.Usuario;
import com.biblioteca.biblioteca_digital.repository.EmprestimoRepository;
import com.biblioteca.biblioteca_digital.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class EmprestimoService {

    private final EmprestimoRepository emprestimoRepository;
    private final LivroRepository livroRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, LivroRepository livroRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
    }

    public Emprestimo emprestarLivro(Livro livro, Usuario usuario) {
        if (!livro.isDisponivel()) {
            throw new RuntimeException("Livro não está disponível para empréstimo.");
        }

        livro.setDisponivel(false);
        livroRepository.save(livro);

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setLivro(livro);
        emprestimo.setUsuario(usuario);
        emprestimo.setDataEmprestimo(LocalDateTime.now());
        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo devolverLivro(Livro livro) {
        // Se o livro já estiver disponível, apenas retorna null (ou pode retornar o último empréstimo)
        if (livro.isDisponivel()) {
            // Opcional: pode buscar o último empréstimo do livro
            return emprestimoRepository.findAll().stream()
                    .filter(e -> e.getLivro().getId().equals(livro.getId()))
                    .reduce((first, second) -> second) // pega o último
                    .orElse(null);
        }

        livro.setDisponivel(true);
        livroRepository.save(livro);

        Emprestimo emprestimo = emprestimoRepository.findAll().stream()
                .filter(e -> e.getLivro().getId().equals(livro.getId()) && e.getDataDevolucao() == null)
                .findFirst()
                .orElse(null); // Retorna null se não achar

        if (emprestimo != null) {
            emprestimo.setDataDevolucao(LocalDateTime.now());
            emprestimo = emprestimoRepository.save(emprestimo);
        }

        return emprestimo;
    }
}
