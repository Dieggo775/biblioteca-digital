package com.biblioteca.biblioteca_digital.controller;

import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.service.LivroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/livros")
@CrossOrigin(origins = "*")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @GetMapping
    public List<Livro> listarTodos() {
        return livroService.listarLivros();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        Optional<Livro> livro = livroService.buscarPorId(id);
        return livro.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Livro> adicionar(@Valid @RequestBody Livro livro) {
        Livro salvo = livroService.salvarLivro(livro);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(@PathVariable Long id, @Valid @RequestBody Livro livroAtualizado) {
        livroAtualizado.setId(id);
        return ResponseEntity.ok(livroService.salvarLivro(livroAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        livroService.deletarLivro(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/titulo/{titulo}")
    public List<Livro> buscarPorTitulo(@PathVariable String titulo) {
        return livroService.buscarPorTitulo(titulo);
    }

    @GetMapping("/autor/{autor}")
    public List<Livro> buscarPorAutor(@PathVariable String autor) {
        return livroService.buscarPorAutor(autor);
    }
}
