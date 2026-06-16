// Loja do comprador — recupera as poções do Web Service via AJAX (fetch).
const API = "/api/pocoes";

function esc(texto) {
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR");
}

function montarCard(p) {
    return `
        <article class="pocao">
            <div class="pocao__frasco">
                <img src="${esc(p.imagem)}" alt="${esc(p.nome)}" loading="lazy"
                     onerror="this.onerror=null;this.src='img/generica.svg'">
            </div>
            <div class="pocao__corpo">
                <h3 class="pocao__nome">${esc(p.nome)}</h3>
                <p class="pocao__descricao">${esc(p.descricao)}</p>
                <div class="pocao__rodape">
                    <span class="pocao__preco">${formatarPreco(p.preco)}<small>moedas</small></span>
                    <button class="btn-comprar" type="button">Comprar</button>
                </div>
            </div>
        </article>`;
}

async function carregarPocoes() {
    const grade = document.getElementById("grade-pocoes");
    if (!grade) return;
    const limite = parseInt(grade.dataset.limit || "0", 10);
    try {
        const resp = await fetch(API);
        if (!resp.ok) throw new Error("Falha na resposta");
        let pocoes = await resp.json();

        if (!pocoes.length) {
            grade.innerHTML = `<p class="vazio">A prateleira está vazia no momento.</p>`;
            return;
        }
        if (limite > 0) pocoes = pocoes.slice(0, limite);
        grade.innerHTML = pocoes.map(montarCard).join("");
    } catch (e) {
        grade.innerHTML = `<p class="vazio">Não foi possível invocar as poções. Recarregue a página.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", carregarPocoes);
