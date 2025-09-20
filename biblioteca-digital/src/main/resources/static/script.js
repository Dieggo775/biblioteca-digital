const urlLivros = "http://localhost:8080/livros";
const urlUsuarios = "http://localhost:8080/usuarios";
const urlEmprestimos = "http://localhost:8080/emprestimos";

let usuarioLogado = null;
let modoEdicao = false;
let livroEditandoId = null;

// Elementos do formulário de livros
const formLivroContainer = document.getElementById("form-livro-container");
const formLivro = document.getElementById("form-livro");
const tituloFormLivro = document.getElementById("titulo-form-livro");
const btnCancelarLivro = document.getElementById("btn-cancelar-livro");
const btnNovoLivro = document.getElementById("btn-novo-livro");

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo = "erro") {
    const div = tipo === "erro" ? document.getElementById("mensagemErro") : document.getElementById("mensagemSucesso");
    div.textContent = mensagem;
    setTimeout(() => { div.textContent = ""; }, 3000);
}

// ===================== LOGIN / CADASTRO =====================
document.getElementById("form-login").addEventListener("submit", async (event) => {
    event.preventDefault();
    const nome = document.getElementById("login-nome").value.trim();
    const email = document.getElementById("login-email").value.trim();
    const telefone = document.getElementById("login-telefone").value.trim();

    if (!nome || !email || !telefone) {
        mostrarMensagem("Preencha todos os campos para entrar/cadastrar.");
        return;
    }

    try {
        const response = await fetch(`${urlUsuarios}?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error(`Erro ao verificar usuário: ${response.statusText}`);
        const usuarios = await response.json();

        if (usuarios.length === 0) {
            mostrarMensagem("Usuário não cadastrado. Acesse a área de cadastro.");
            return;
        }

        usuarioLogado = usuarios[0];
        document.getElementById("area-login").style.display = "none";
        document.getElementById("area-livros").style.display = "block";
        listarLivros();
    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao acessar usuário.");
    }
});

// ===================== LISTAR LIVROS =====================
async function listarLivros() {
    if (!usuarioLogado) return;

    try {
        const response = await fetch(urlLivros);
        if (!response.ok) throw new Error(`Erro ao buscar livros: ${response.statusText}`);
        const data = await response.json();

        const lista = document.getElementById("lista-livros");
        lista.innerHTML = "";

        data.forEach(livro => {
            const card = document.createElement("div");
            card.className = "livro-card";

            const imagem = document.createElement("img");
            imagem.src = livro.imagemUrl || "https://via.placeholder.com/150x220?text=Sem+Imagem";
            imagem.alt = livro.titulo;
            card.appendChild(imagem);

            const info = document.createElement("div");
            info.className = "livro-info";
            info.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Ano:</strong> ${livro.anoPublicacao}</p>
                <p><strong>ISBN:</strong> ${livro.isbn}</p>
            `;
            card.appendChild(info);

            // Botões
            const btnEmprestar = document.createElement("button");
            btnEmprestar.textContent = "Emprestar";
            btnEmprestar.onclick = () => emprestarLivro(livro.id);
            card.appendChild(btnEmprestar);

            const btnDevolver = document.createElement("button");
            btnDevolver.textContent = "Devolver";
            btnDevolver.onclick = () => devolverLivro(livro.id);
            card.appendChild(btnDevolver);

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.onclick = () => prepararEdicao(livro);
            card.appendChild(btnEditar);

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.onclick = () => deletarLivro(livro.id);
            card.appendChild(btnExcluir);

            lista.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao carregar livros.");
    }
}

// ===================== EMPRESTAR / DEVOLVER =====================
async function emprestarLivro(livroId) {
    if (!usuarioLogado) { mostrarMensagem("Você precisa estar logado para emprestar."); return; }
    try {
        const response = await fetch(urlEmprestimos, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuarioId: usuarioLogado.id, livroId })
        });
        if (!response.ok) throw new Error(`Erro ao emprestar livro: ${response.statusText}`);
        mostrarMensagem("Livro emprestado com sucesso!", "sucesso");
        listarLivros();
    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao emprestar livro.");
    }
}

async function devolverLivro(livroId) {
    if (!usuarioLogado) { mostrarMensagem("Você precisa estar logado para devolver."); return; }
    try {
        const response = await fetch(`${urlEmprestimos}/devolver`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuarioId: usuarioLogado.id, livroId })
        });
        if (!response.ok) throw new Error(`Erro ao devolver livro: ${response.statusText}`);
        mostrarMensagem("Livro devolvido com sucesso!", "sucesso");
        listarLivros();
    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao devolver livro.");
    }
}

// ===================== EDIÇÃO / ADIÇÃO LIVRO =====================
function prepararEdicao(livro) {
    modoEdicao = true;
    livroEditandoId = livro.id;

    tituloFormLivro.textContent = "Editar Livro";
    formLivroContainer.style.display = "block";

    document.getElementById("livro-titulo").value = livro.titulo;
    document.getElementById("livro-autor").value = livro.autor;
    document.getElementById("livro-ano").value = livro.anoPublicacao;
    document.getElementById("livro-isbn").value = livro.isbn;
    document.getElementById("livro-imagem").value = livro.imagemUrl || "";
}

function prepararNovoLivro() {
    modoEdicao = false;
    livroEditandoId = null;

    tituloFormLivro.textContent = "Adicionar Livro";
    formLivroContainer.style.display = "block";

    formLivro.reset();
}

// ===================== SALVAR / ATUALIZAR LIVRO =====================
formLivro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dados = {
        titulo: document.getElementById("livro-titulo").value,
        autor: document.getElementById("livro-autor").value,
        anoPublicacao: parseInt(document.getElementById("livro-ano").value),
        isbn: document.getElementById("livro-isbn").value,
        imagemUrl: document.getElementById("livro-imagem").value
    };

    try {
        let response;
        if (modoEdicao) {
            response = await fetch(`${urlLivros}/${livroEditandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
        } else {
            response = await fetch(urlLivros, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados)
            });
        }

        if (!response.ok) throw new Error("Erro ao salvar livro");

        mostrarMensagem(`Livro ${modoEdicao ? "atualizado" : "adicionado"} com sucesso!`, "sucesso");
        formLivroContainer.style.display = "none";
        listarLivros();
    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao salvar livro.");
    }
});

// ===================== EXCLUIR LIVRO =====================
async function deletarLivro(livroId) {
    if (!confirm("Deseja realmente excluir este livro?")) return;

    try {
        const response = await fetch(`${urlLivros}/${livroId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao deletar livro");
        mostrarMensagem("Livro excluído com sucesso!", "sucesso");
        listarLivros();
    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao excluir livro.");
    }
}

// ===================== CANCELAR EDIÇÃO =====================
btnCancelarLivro.addEventListener("click", () => {
    formLivroContainer.style.display = "none";
    modoEdicao = false;
    livroEditandoId = null;
});

// ===================== NOVO LIVRO =====================
btnNovoLivro.addEventListener("click", prepararNovoLivro);

// ===================== FILTRO POR TÍTULO =====================
document.getElementById("busca").addEventListener("input", async function() {
    const termo = this.value.toLowerCase();

    try {
        const response = await fetch(urlLivros);
        if (!response.ok) throw new Error(`Erro ao buscar livros: ${response.statusText}`);
        const data = await response.json();

        const filtrados = data.filter(livro => livro.titulo.toLowerCase().includes(termo));

        const lista = document.getElementById("lista-livros");
        lista.innerHTML = "";
        filtrados.forEach(livro => {
            const card = document.createElement("div");
            card.className = "livro-card";

            const imagem = document.createElement("img");
            imagem.src = livro.imagemUrl || "https://via.placeholder.com/150x220?text=Sem+Imagem";
            imagem.alt = livro.titulo;
            card.appendChild(imagem);

            const info = document.createElement("div");
            info.className = "livro-info";
            info.innerHTML = `
                <h3>${livro.titulo}</h3>
                <p><strong>Autor:</strong> ${livro.autor}</p>
                <p><strong>Ano:</strong> ${livro.anoPublicacao}</p>
                <p><strong>ISBN:</strong> ${livro.isbn}</p>
            `;
            card.appendChild(info);

            // Botões
            const btnEmprestar = document.createElement("button");
            btnEmprestar.textContent = "Emprestar";
            btnEmprestar.onclick = () => emprestarLivro(livro.id);
            card.appendChild(btnEmprestar);

            const btnDevolver = document.createElement("button");
            btnDevolver.textContent = "Devolver";
            btnDevolver.onclick = () => devolverLivro(livro.id);
            card.appendChild(btnDevolver);

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.onclick = () => prepararEdicao(livro);
            card.appendChild(btnEditar);

            const btnExcluir = document.createElement("button");
            btnExcluir.textContent = "Excluir";
            btnExcluir.onclick = () => deletarLivro(livro.id);
            card.appendChild(btnExcluir);

            lista.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao filtrar livros.");
    }
});

// ===================== INICIALIZAÇÃO =====================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("area-livros").style.display = "none";
});
