-- ===== Inserção de Usuários =====
INSERT INTO Usuario (nome, email, telefone)
VALUES
("Ana Silva", "ana.silva@email.com", "11988887777"),
("João Santos", "joao.santos@email.com", "11999998888"),
("Maria Oliveira", "maria.oliveira@email.com", "11977776666");

-- ===== Inserção de Livros =====
INSERT INTO Livro (titulo, autor, isbn, ano_publicacao, imagem_url, disponivel)
VALUES
("A Arte da Guerra", "Sun Tzu", "978-85-7827-040- Sun", 500, "url_imagem_guerra.jpg", TRUE),
("Dom Quixote", "Miguel de Cervantes", "978-85-359-0756- Dom", 1605, "url_imagem_quixote.jpg", TRUE),
("1984", "George Orwell", "978-85-221-0611- 1984", 1949, "url_imagem_1984.jpg", TRUE),
("Orgulho e Preconceito", "Jane Austen", "978-85-319-0756- Orgulho", 1813, "url_imagem_orgulho.jpg", TRUE),
("O Pequeno Príncipe", "Antoine de Saint-Exupéry", "978-85-7827-040- Pequeno", 1943, "url_imagem_pequeno.jpg", TRUE);

-- ===== Inserção de Empréstimos =====
-- Exemplo: Livro 1 emprestado para Usuário 1
INSERT INTO Emprestimo (livro_id, usuario_id, data_emprestimo)
VALUES
(1, 1, NOW());

-- Atualiza o status do livro para indisponível
UPDATE Livro SET disponivel = FALSE WHERE id = 1;

