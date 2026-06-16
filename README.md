# Poções &amp; Soluções

Web Service e loja online da botica de Annabelle Merigold.
**SCC0219 — Introdução ao Desenvolvimento Web — Atividade Prática 2.**

Cadastro, listagem e remoção de poções (nome, descrição, imagem, preço),
com banco **SQLite em memória** via Sequelize. O front-end consome o serviço
por **JavaScript + AJAX** (`fetch`).

---

## Requisitos

- Node.js 18 ou superior (usa `import` ESM e `node --watch`).
- npm.

## Instalação

```bash
npm install
```

Instala `express`, `sequelize` e `sqlite3`.

## Execução

```bash
npm start
```

Saída esperada:

```
Poções e Soluções rodando em http://localhost:3000
Administração em http://localhost:3000/admin.html
```

| Página        | URL                                  | O que tem                                  |
| ------------- | ------------------------------------ | ------------------------------------------ |
| Início        | http://localhost:3000/               | Hero, descrição da loja, destaques         |
| História      | http://localhost:3000/historia.html  | Histórico de 1867 com fotos e linha do tempo |
| Poções        | http://localhost:3000/pocoes.html    | Grade de produtos (via AJAX) + botão Comprar |
| Administração | http://localhost:3000/admin.html     | Cadastrar, listar e remover poções         |

> Banco em memória: os dados reiniciam a cada `npm start` e o estoque é
> repovoado com as poções de exemplo da atividade.

Modo desenvolvimento (reinicia ao salvar):

```bash
npm run dev
```

---

## Web Service (REST)

Base: `/api/pocoes`

| Método   | Rota              | Ação                  |
| -------- | ----------------- | --------------------- |
| `GET`    | `/api/pocoes`     | Lista todas as poções |
| `GET`    | `/api/pocoes/:id` | Busca uma poção       |
| `POST`   | `/api/pocoes`     | Cadastra uma poção    |
| `DELETE` | `/api/pocoes/:id` | Remove uma poção      |

Corpo do `POST` (JSON):

```json
{
  "nome": "Poção do Sono",
  "descricao": "Garante uma noite tranquila.",
  "imagem": "https://exemplo.com/pocao.png",
  "preco": 250
}
```

Exemplos com `curl`:

```bash
curl http://localhost:3000/api/pocoes
curl -X POST http://localhost:3000/api/pocoes -H "Content-Type: application/json" \
  -d '{"nome":"Poção do Sono","descricao":"Noite tranquila.","imagem":"img/generica.svg","preco":250}'
curl -X DELETE http://localhost:3000/api/pocoes/1
```

---

## Estrutura

```
pocoes-solucoes/
├── server.js              Web Service (Express + Sequelize + SQLite em memória)
├── package.json
├── public/
│   ├── index.html         Início
│   ├── historia.html      História (1867)
│   ├── pocoes.html        Poções (produtos via AJAX)
│   ├── admin.html         Administração (CRUD)
│   ├── css/style.css      Paleta escura + fonte Gill Sans
│   ├── js/
│       ├── loja.js        AJAX: lista poções (loja e destaques)
│       └── admin.js       AJAX: cadastra, lista e remove
│   
└── README.md
```

## Notas de design

- Paleta escura e fonte **Gill Sans** (com fallbacks), conforme pedido da
  cliente. Serifa **EB Garamond** usada nos títulos e no selo "Est. 1867".
- "História" e "Poções" são páginas separadas, acessíveis pelo menu.
- As imagens são **SVGs locais** (frascos coloridos e cenas em sépia), então o
  site não depende de imagens externas. Ao cadastrar uma poção nova, basta
  informar a URL ou o caminho; se a imagem falhar, cai em `img/generica.svg`.
