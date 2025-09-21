package com.biblioteca.biblioteca_digital.services;

import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.model.Usuario;
import com.biblioteca.biblioteca_digital.repository.LivroRepository;
import org.springframework.stereotype.Service;

@Service
public class EmprestimoService {

    private final LivroRepository livroRepository;

    public EmprestimoService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    public void emprestarLivro(Livro livro, Usuario usuario) {
        if (!livro.getDisponivel()) {
            throw new RuntimeException("Livro indisponível para empréstimo");
        }
        livro.setDisponivel(false);
        livroRepository.save(livro);
    }

    public void devolverLivro(Livro livro) {
        livro.setDisponivel(true);
        livroRepository.save(livro);
    }
}
