package com.biblioteca.biblioteca_digital.controller;

import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.services.LivroService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/livros")
@CrossOrigin
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @GetMapping
    public List<Livro> listarLivros() {
        return livroService.listarLivros();
    }

    @GetMapping("/{id}")
    public Livro buscarPorId(@PathVariable Long id) {
        return livroService.buscarPorId(id);
    }

    @PostMapping
    public Livro salvarLivro(@RequestBody Livro livro) {
        return livroService.salvarLivro(livro);
    }

    @PutMapping("/{id}")
    public Livro atualizarLivro(@PathVariable Long id, @RequestBody Livro livro) {
        Livro livroExistente = livroService.buscarPorId(id);
        livroExistente.setTitulo(livro.getTitulo());
        livroExistente.setAutor(livro.getAutor());
        livroExistente.setIsbn(livro.getIsbn());
        livroExistente.setAnoPublicacao(livro.getAnoPublicacao());
        livroExistente.setImagemUrl(livro.getImagemUrl());
        livroExistente.setDisponivel(livro.getDisponivel());
        return livroService.salvarLivro(livroExistente);
    }

    @DeleteMapping("/{id}")
    public void deletarLivro(@PathVariable Long id) {
        livroService.deletarLivro(id);
    }
}
