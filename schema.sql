-- ===== Banco de dados: biblioteca_db =====
USE biblioteca_db;

-- ===== Tabela Livro =====
CREATE TABLE IF NOT EXISTS Livro (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    isbn VARCHAR(50) NOT NULL UNIQUE,
    ano_publicacao INT,
    imagem_url VARCHAR(500),
    disponivel BOOLEAN DEFAULT TRUE
);

-- ===== Tabela Usuario =====
CREATE TABLE IF NOT EXISTS Usuario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(50)
);

-- ===== Tabela Emprestimo =====
CREATE TABLE IF NOT EXISTS Emprestimo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    livro_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    data_emprestimo DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_devolucao DATETIME,
    CONSTRAINT fk_livro FOREIGN KEY (livro_id) REFERENCES Livro(id),
    CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- ===== Índices para otimização de busca =====
CREATE INDEX idx_livro_titulo ON Livro(titulo);
CREATE INDEX idx_livro_autor ON Livro(autor);
CREATE INDEX idx_emprestimo_usuario ON Emprestimo(usuario_id);
CREATE INDEX idx_emprestimo_livro ON Emprestimo(livro_id);

