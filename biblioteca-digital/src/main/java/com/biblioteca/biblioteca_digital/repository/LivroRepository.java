package com.biblioteca.biblioteca_digital.repository;

import com.biblioteca.biblioteca_digital.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LivroRepository extends JpaRepository<Livro, Long> {

    // Busca por título (contendo o texto, ignorando maiúsculas/minúsculas)
    List<Livro> findByTituloContainingIgnoreCase(String titulo);

    // Busca por autor (contendo o texto, ignorando maiúsculas/minúsculas)
    List<Livro> findByAutorContainingIgnoreCase(String autor);
}
