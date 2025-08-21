package com.biblioteca.biblioteca_digital.controller;

import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.model.Usuario;
import com.biblioteca.biblioteca_digital.service.EmprestimoService;
import com.biblioteca.biblioteca_digital.service.LivroService;
import com.biblioteca.biblioteca_digital.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emprestimos")
@CrossOrigin(origins = "*")
public class EmprestimoController {

    private final EmprestimoService emprestimoService;
    private final LivroService livroService;
    private final UsuarioService usuarioService;

    public EmprestimoController(EmprestimoService emprestimoService,
                                LivroService livroService,
                                UsuarioService usuarioService) {
        this.emprestimoService = emprestimoService;
        this.livroService = livroService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/emprestar")
    public void emprestar(@RequestParam Long livroId, @RequestParam Long usuarioId) {
        Livro livro = livroService.buscarPorId(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        Usuario usuario = usuarioService.buscarPorId(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        emprestimoService.emprestarLivro(livro, usuario);
    }

    @PostMapping("/devolver")
    public void devolver(@RequestParam Long livroId) {
        Livro livro = livroService.buscarPorId(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        emprestimoService.devolverLivro(livro);
    }
}
