package com.biblioteca.biblioteca_digital.controller;

import com.biblioteca.biblioteca_digital.model.Livro;
import com.biblioteca.biblioteca_digital.model.Usuario;
import com.biblioteca.biblioteca_digital.services.EmprestimoService;
import com.biblioteca.biblioteca_digital.services.LivroService;
import com.biblioteca.biblioteca_digital.services.UsuarioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emprestimos")
@CrossOrigin
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
        Livro livro = livroService.buscarPorId(livroId);
        Usuario usuario = usuarioService.buscarPorId(usuarioId);
        emprestimoService.emprestarLivro(livro, usuario);
    }

    @PostMapping("/devolver")
    public void devolver(@RequestParam Long livroId) {
        Livro livro = livroService.buscarPorId(livroId);
        emprestimoService.devolverLivro(livro);
    }
}
