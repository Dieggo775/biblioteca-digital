const url = "http://localhost:8080/livros";

let modoEdicao = false;
let livroEditandoId = null;

// Função para listar livros
function listarLivros() {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Erro ao buscar livros");
      return response.json();
    })
    .then(data => {
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

        // Botão Editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => carregarParaEdicao(livro);
        card.appendChild(btnEditar);

        // Botão Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = () => excluirLivro(livro.id);
        card.appendChild(btnExcluir);

        lista.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Erro:", error);
      alert("Erro ao carregar livros.");
    });
}

// Função para cadastrar ou editar livro
document.getElementById("form-livro").addEventListener("submit", function(event) {
  event.preventDefault();

  const novoLivro = {
    titulo: document.getElementById("titulo").value,
    autor: document.getElementById("autor").value,
    isbn: document.getElementById("isbn").value,
    anoPublicacao: parseInt(document.getElementById("ano").value),
    imagemUrl: document.getElementById("imagem").value
  };

  const metodo = modoEdicao ? "PUT" : "POST";
  const endpoint = modoEdicao ? `${url}/${livroEditandoId}` : url;

  fetch(endpoint, {
    method: metodo,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(novoLivro)
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao salvar livro");
    return response.json();
  })
  .then(data => {
    alert(modoEdicao ? "Livro atualizado com sucesso!" : "Livro cadastrado com sucesso!");
    listarLivros();
    document.getElementById("form-livro").reset();
    modoEdicao = false;
    livroEditandoId = null;
  })
  .catch(error => {
    console.error("Erro:", error);
    alert("Erro ao salvar livro.");
  });
});

// Função para carregar dados no formulário para edição
function carregarParaEdicao(livro) {
  document.getElementById("titulo").value = livro.titulo;
  document.getElementById("autor").value = livro.autor;
  document.getElementById("isbn").value = livro.isbn;
  document.getElementById("ano").value = livro.anoPublicacao;
  document.getElementById("imagem").value = livro.imagemUrl;

  modoEdicao = true;
  livroEditandoId = livro.id;
}

// Função para excluir livro
function excluirLivro(id) {
  if (!confirm("Deseja realmente excluir este livro?")) return;

  fetch(`${url}/${id}`, {
    method: "DELETE"
  })
  .then(response => {
    if (!response.ok) throw new Error("Erro ao excluir livro");
    listarLivros();
  })
  .catch(error => {
    console.error("Erro:", error);
    alert("Erro ao excluir livro.");
  });
}

// Função de busca por título
document.getElementById("busca").addEventListener("input", function() {
  const termo = this.value.toLowerCase();

  fetch(url)
    .then(response => response.json())
    .then(data => {
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

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.onclick = () => carregarParaEdicao(livro);
        card.appendChild(btnEditar);

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.onclick = () => excluirLivro(livro.id);
        card.appendChild(btnExcluir);

        lista.appendChild(card);
      });
    });
});

// Inicializa a lista ao carregar
document.addEventListener("DOMContentLoaded", listarLivros);