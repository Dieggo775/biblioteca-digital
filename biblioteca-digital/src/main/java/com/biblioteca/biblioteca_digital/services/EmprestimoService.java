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
        if (!livro.isDisponivel()) {
            throw new RuntimeException("Livro indisponível para empréstimo.");
        }
        livro.setDisponivel(false);
        livroRepository.save(livro);

        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setLivro(livro);
        emprestimo.setUsuario(usuario);
        emprestimo.setDataEmprestimo(LocalDateTime.now());

        emprestimoRepository.save(emprestimo);
    }

    public void devolverLivro(Livro livro) {
        if (livro.isDisponivel()) {
            throw new RuntimeException("Livro já está disponível.");
        }
        livro.setDisponivel(true);
        livroRepository.save(livro);
    }
}
