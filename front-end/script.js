const urlLivros = "http://localhost:8080/livros";
const urlUsuarios = "http://localhost:8080/usuarios";
const urlEmprestimos = "http://localhost:8080/emprestimos";

let usuarioLogado = null;
let modoEdicao = false;
let livroEditandoId = null;

// Função para mostrar mensagens de erro ou sucesso
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
        mostrarMensagem("Erro ao acessar usuário. Veja o console para detalhes.");
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

            const btnEmprestar = document.createElement("button");
            btnEmprestar.textContent = "Emprestar";
            btnEmprestar.onclick = () => emprestarLivro(livro.id);
            card.appendChild(btnEmprestar);

            const btnDevolver = document.createElement("button");
            btnDevolver.textContent = "Devolver";
            btnDevolver.onclick = () => devolverLivro(livro.id);
            card.appendChild(btnDevolver);

            lista.appendChild(card);
        });

    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao carregar livros.");
    }
}

// ===================== EMPRESTAR / DEVOLVER =====================

async function emprestarLivro(livroId) {
    if (!usuarioLogado) {
        mostrarMensagem("Você precisa estar logado para emprestar.");
        return;
    }

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
    if (!usuarioLogado) {
        mostrarMensagem("Você precisa estar logado para devolver.");
        return;
    }

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

// ===================== FILTRO POR TÍTULO =====================

document.getElementById("busca").addEventListener("input", async function() {
    const termo = this.value.toLowerCase();

    try {
        const response = await fetch(urlLivros);
        if (!response.ok) throw new Error(`Erro ao buscar livros: ${response.statusText}`);
        const data = await response.json();

        const filtrados = data.filter(livro =>
            livro.titulo.toLowerCase().includes(termo)
        );

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

            const btnEmprestar = document.createElement("button");
            btnEmprestar.textContent = "Emprestar";
            btnEmprestar.onclick = () => emprestarLivro(livro.id);
            card.appendChild(btnEmprestar);

            const btnDevolver = document.createElement("button");
            btnDevolver.textContent = "Devolver";
            btnDevolver.onclick = () => devolverLivro(livro.id);
            card.appendChild(btnDevolver);

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
