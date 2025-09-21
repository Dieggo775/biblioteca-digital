const urlLivros = "http://localhost:8080/livros";
const urlUsuarios = "http://localhost:8080/usuarios";
const urlEmprestimos = "http://localhost:8080/emprestimos";

let usuarioLogado = null;
let modoEdicao = false;
let livroEditandoId = null;

// ===================== MENSAGENS =====================
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
        const livros = await response.json();

        const lista = document.getElementById("lista-livros");
        lista.innerHTML = "";

        livros.forEach(livro => {
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
                <p><strong>Disponibilidade:</strong>
                    <span class="${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                </p>
            `;
            card.appendChild(info);

            // Botões
            const btnEmprestar = document.createElement("button");
            btnEmprestar.className = "emprestar";
            btnEmprestar.textContent = "Emprestar";
            btnEmprestar.disabled = !livro.disponivel;
            btnEmprestar.onclick = () => emprestarLivro(livro.id);
            card.appendChild(btnEmprestar);

            const btnDevolver = document.createElement("button");
            btnDevolver.className = "devolver";
            btnDevolver.textContent = "Devolver";
            btnDevolver.disabled = livro.disponivel;
            btnDevolver.onclick = () => devolverLivro(livro.id);
            card.appendChild(btnDevolver);

            const btnEditar = document.createElement("button");
            btnEditar.className = "editar";
            btnEditar.textContent = "Editar";
            btnEditar.onclick = () => abrirFormularioEdicao(livro);
            card.appendChild(btnEditar);

            const btnExcluir = document.createElement("button");
            btnExcluir.className = "excluir";
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
    if (!usuarioLogado) {
        mostrarMensagem("Você precisa estar logado para emprestar.");
        return;
    }

    try {
        const response = await fetch(`${urlEmprestimos}/emprestar?livroId=${livroId}&usuarioId=${usuarioLogado.id}`, {
            method: "POST"
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
        const response = await fetch(`${urlEmprestimos}/devolver?livroId=${livroId}`, {
            method: "POST"
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
        const livros = await response.json();

        const filtrados = livros.filter(livro => livro.titulo.toLowerCase().includes(termo));

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
                <p><strong>Disponibilidade:</strong>
                    <span class="${livro.disponivel ? 'disponivel' : 'indisponivel'}">
                        ${livro.disponivel ? 'Disponível' : 'Indisponível'}
                    </span>
                </p>
            `;
            card.appendChild(info);

            const btnEmprestar = document.createElement("button");
            btnEmprestar.className = "emprestar";
            btnEmprestar.textContent = "Emprestar";
            btnEmprestar.disabled = !livro.disponivel;
            btnEmprestar.onclick = () => emprestarLivro(livro.id);
            card.appendChild(btnEmprestar);

            const btnDevolver = document.createElement("button");
            btnDevolver.className = "devolver";
            btnDevolver.textContent = "Devolver";
            btnDevolver.disabled = livro.disponivel;
            btnDevolver.onclick = () => devolverLivro(livro.id);
            card.appendChild(btnDevolver);

            const btnEditar = document.createElement("button");
            btnEditar.className = "editar";
            btnEditar.textContent = "Editar";
            btnEditar.onclick = () => abrirFormularioEdicao(livro);
            card.appendChild(btnEditar);

            const btnExcluir = document.createElement("button");
            btnExcluir.className = "excluir";
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

// ===================== FORMULÁRIO LATERAL =====================
const formContainer = document.getElementById("form-livro-container");
const formLivro = document.getElementById("form-livro");
const btnNovoLivro = document.getElementById("btn-novo-livro");
const btnCancelar = document.getElementById("btn-cancelar-livro");

btnNovoLivro.onclick = () => abrirFormularioNovo();
btnCancelar.onclick = () => fecharFormulario();

function abrirFormularioNovo() {
    modoEdicao = false;
    livroEditandoId = null;
    document.getElementById("form-livro-titulo").textContent = "Novo Livro";
    formLivro.reset();
    formContainer.classList.add("show");
}

function abrirFormularioEdicao(livro) {
    modoEdicao = true;
    livroEditandoId = livro.id;
    document.getElementById("form-livro-titulo").textContent = "Editar Livro";
    document.getElementById("livro-titulo").value = livro.titulo;
    document.getElementById("livro-autor").value = livro.autor;
    document.getElementById("livro-isbn").value = livro.isbn;
    document.getElementById("livro-ano").value = livro.anoPublicacao;
    document.getElementById("livro-imagem").value = livro.imagemUrl || "";
    formContainer.classList.add("show");
}

function fecharFormulario() {
    formContainer.classList.remove("show");
}

// ===================== SALVAR LIVRO =====================
formLivro.addEventListener("submit", async (event) => {
    event.preventDefault();

    const livroData = {
        titulo: document.getElementById("livro-titulo").value.trim(),
        autor: document.getElementById("livro-autor").value.trim(),
        isbn: document.getElementById("livro-isbn").value.trim(),
        anoPublicacao: parseInt(document.getElementById("livro-ano").value),
        imagemUrl: document.getElementById("livro-imagem").value.trim(),
        disponivel: true
    };

    try {
        let response;
        if (modoEdicao && livroEditandoId) {
            response = await fetch(`${urlLivros}/${livroEditandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(livroData)
            });
        } else {
            response = await fetch(urlLivros, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(livroData)
            });
        }

        if (!response.ok) throw new Error(`Erro ao salvar livro: ${response.statusText}`);
        fecharFormulario();
        listarLivros();
        mostrarMensagem("Livro salvo com sucesso!", "sucesso");

    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao salvar livro.");
    }
});

// ===================== DELETAR LIVRO =====================
async function deletarLivro(livroId) {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    try {
        const response = await fetch(`${urlLivros}/${livroId}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error(`Erro ao deletar livro: ${response.statusText}`);
        listarLivros();
        mostrarMensagem("Livro excluído com sucesso!", "sucesso");
    } catch (error) {
        console.error("Erro:", error);
        mostrarMensagem("Erro ao excluir livro.");
    }
}

// ===================== INICIALIZAÇÃO =====================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("area-livros").style.display = "none";
});
