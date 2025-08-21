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

    public void emprestarLivro(Livro livro, Usuario usuario) {
        if (!livro.isDisponivel()) throw new RuntimeException("Livro não disponível");

        livro.setDisponivel(false);
        livroRepository.save(livro);

        Emprestimo e = new Emprestimo();
        e.setLivro(livro);
        e.setUsuario(usuario);
        e.setDataEmprestimo(LocalDateTime.now());
        emprestimoRepository.save(e);
    }

    public void devolverLivro(Livro livro) {
        if (livro.isDisponivel()) throw new RuntimeException("Livro já está disponível");

        livro.setDisponivel(true);
        livroRepository.save(livro);

        // Atualiza a devolução do último empréstimo do livro
        Emprestimo e = emprestimoRepository.findAll().stream()
                .filter(emp -> emp.getLivro().getId().equals(livro.getId()) && emp.getDataDevolucao() == null)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado"));

        e.setDataDevolucao(LocalDateTime.now());
        emprestimoRepository.save(e);
    }
}
