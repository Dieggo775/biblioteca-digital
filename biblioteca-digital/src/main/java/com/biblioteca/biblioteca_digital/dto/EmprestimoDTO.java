package com.biblioteca.biblioteca_digital.dto;

public class EmprestimoDTO {
    private Long livroId;
    private Long usuarioId;

    public EmprestimoDTO() {}

    public EmprestimoDTO(Long livroId, Long usuarioId) {
        this.livroId = livroId;
        this.usuarioId = usuarioId;
    }

    public Long getLivroId() {
        return livroId;
    }

    public void setLivroId(Long livroId) {
        this.livroId = livroId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
