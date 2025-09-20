package com.biblioteca.biblioteca_digital.repository;

import com.biblioteca.biblioteca_digital.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    List<Usuario> findByEmailIgnoreCase(String email);
}
