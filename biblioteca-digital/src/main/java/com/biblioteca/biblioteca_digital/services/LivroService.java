package com.biblioteca.biblioteca_digital.service;

import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }

    public Livro salvarLivro(Livro livro) {
        // Checa ISBN duplicado
        Optional<Livro> existente = livroRepository.findAll().stream()
                .filter(l -> l.getIsbn().equals(livro.getIsbn()) && !l.getId().equals(livro.getId()))
                .findFirst();

        if (existente.isPresent()) {
            throw new RuntimeException("ISBN já cadastrado para outro livro");
        }

        return livroRepository.save(livro);
    }

    public List<Livro> listarLivros() {
        return livroRepository.findAll();
    }

    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

    public void deletarLivro(Long id) {
        livroRepository.deleteById(id);
    }

    // Busca livros por título
    public List<Livro> buscarPorTitulo(String titulo) {
        return livroRepository.findByTituloContainingIgnoreCase(titulo);
    }

    // Busca livros por autor
    public List<Livro> buscarPorAutor(String autor) {
        return livroRepository.findByAutorContainingIgnoreCase(autor);
    }
}
