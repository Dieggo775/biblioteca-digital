package com.biblioteca.biblioteca_digital.service;

import com.biblioteca.biblioteca_digital.model.Usuario;
import com.biblioteca.biblioteca_digital.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listarUsuarios() { return usuarioRepository.findAll(); }

    public Optional<Usuario> buscarPorId(Long id) { return usuarioRepository.findById(id); }

    public Usuario salvarUsuario(Usuario usuario) { return usuarioRepository.save(usuario); }

    public void deletarUsuario(Long id) { usuarioRepository.deleteById(id); }

    public List<Usuario> buscarPorEmail(String email) { return usuarioRepository.findByEmailIgnoreCase(email); }
}
