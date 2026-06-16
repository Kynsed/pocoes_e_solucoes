// Painel de administração — cadastrar, listar e remover poções via AJAX.
const API = "/api/pocoes";

function esc(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR");
}

function mostrarAviso(mensagem, tipo) {
    const aviso = document.getElementById("aviso");
    if (!aviso) return;
    aviso.textContent = mensagem;
    aviso.className = `aviso aviso--${tipo}`;
    if (tipo === "ok") setTimeout(() => (aviso.className = "aviso"), 3500);
}

// ---------- Listar ----------
function montarLinha(p) {
    return `
        <div class="linha" data-id="${p.id}">
            <img class="linha__img" src="${esc(p.imagem)}" alt="${esc(p.nome)}"
                 onerror="this.onerror=null;this.src='img/generica.svg'">
            <div class="linha__info">
                <p class="linha__nome">${esc(p.nome)}</p>
                <p class="linha__desc">${esc(p.descricao)}</p>
            </div>
            <span class="linha__preco">${formatarPreco(p.preco)} moedas</span>
            <button class="btn-remover" type="button"
                    data-id="${p.id}" data-nome="${esc(p.nome)}">Remover</button>
        </div>`;
}

async function carregarEstoque() {
    const lista = document.getElementById("lista-admin");
    const contador = document.getElementById("contador");
    try {
        const resp = await fetch(API);
        if (!resp.ok) throw new Error("Falha na resposta");
        const pocoes = await resp.json();

        if (contador) contador.textContent = `(${pocoes.length})`;

        if (!pocoes.length) {
            lista.innerHTML = `<p class="vazio">Nenhuma poção cadastrada.</p>`;
            return;
        }
        lista.innerHTML = pocoes.map(montarLinha).join("");

        lista.querySelectorAll(".btn-remover").forEach((btn) => {
            btn.addEventListener("click", () =>
                removerPocao(btn.dataset.id, btn.dataset.nome)
            );
        });
    } catch (e) {
        console.error("[admin] erro ao carregar estoque:", e);
        lista.innerHTML = `<p class="vazio">Não foi possível carregar o estoque.</p>`;
    }
}

// ---------- Cadastrar ----------
async function cadastrarPocao() {
    console.log("[admin] clicou em Cadastrar");

    const nome = document.getElementById("nome").value.trim();
    const preco = document.getElementById("preco").value;
    const imagem = document.getElementById("imagem").value.trim();
    const descricao = document.getElementById("descricao").value.trim();

    if (!nome || !descricao || !imagem || preco === "") {
        mostrarAviso("Preencha todos os campos (nome, preço, imagem e descrição).", "erro");
        return;
    }

    try {
        const resp = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, descricao, imagem, preco: Number(preco) }),
        });

        if (!resp.ok) {
            const erro = await resp.json().catch(() => ({}));
            throw new Error(erro.erro || `Erro ${resp.status} ao cadastrar`);
        }

        document.getElementById("nome").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("imagem").value = "";
        document.getElementById("descricao").value = "";

        mostrarAviso(`"${nome}" adicionada à prateleira.`, "ok");
        carregarEstoque();
    } catch (e) {
        console.error("[admin] erro ao cadastrar:", e);
        if (e instanceof TypeError) {
            mostrarAviso("Servidor não respondeu. Confirme que o 'npm start' está rodando e acesse por http://localhost:3000/admin.html", "erro");
        } else {
            mostrarAviso(e.message, "erro");
        }
    }
}

// ---------- Remover ----------
async function removerPocao(id, nome) {
    if (!confirm(`Remover "${nome}" do estoque?`)) return;
    try {
        const resp = await fetch(`${API}/${id}`, { method: "DELETE" });
        if (!resp.ok && resp.status !== 204) throw new Error("Erro ao remover");
        mostrarAviso(`"${nome}" removida.`, "ok");
        carregarEstoque();
    } catch (e) {
        console.error("[admin] erro ao remover:", e);
        mostrarAviso(e.message, "erro");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-cadastrar");
    if (!btn) {
        console.error("[admin] botão #btn-cadastrar NÃO encontrado — admin.html desatualizado?");
        return;
    }
    btn.addEventListener("click", cadastrarPocao);
    // Enter nos campos também cadastra
    ["nome", "preco", "imagem"].forEach((campo) => {
        const el = document.getElementById(campo);
        if (el) el.addEventListener("keydown", (ev) => { if (ev.key === "Enter") cadastrarPocao(); });
    });
    console.log("[admin] pronto — listener de cadastro ativo");
    carregarEstoque();
});
