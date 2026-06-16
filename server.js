import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ----- Banco SQLite em memória (DICA OBRIGATÓRIA da atividade) -----
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
});

// ----- Modelo Poção -----
const Pocao = sequelize.define(
    "Pocao",
    {
        nome: { type: DataTypes.STRING, allowNull: false },
        descricao: { type: DataTypes.TEXT, allowNull: false },
        imagem: { type: DataTypes.STRING, allowNull: false },
        preco: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "pocoes", timestamps: false }
);

// ROTAS DO WEB SERVICE 

// Listar todas as poções
app.get("/api/pocoes", async (req, res) => {
    const pocoes = await Pocao.findAll({ order: [["id", "ASC"]] });
    res.json(pocoes);
});

// Buscar uma poção
app.get("/api/pocoes/:id", async (req, res) => {
    const pocao = await Pocao.findByPk(req.params.id);
    if (!pocao) return res.status(404).json({ erro: "Poção não encontrada" });
    res.json(pocao);
});

// Cadastrar poção
app.post("/api/pocoes", async (req, res) => {
    try {
        const { nome, descricao, imagem, preco } = req.body;
        if (!nome || !descricao || !imagem || preco == null || preco === "") {
            return res.status(400).json({ erro: "Preencha nome, descrição, imagem e preço." });
        }
        const nova = await Pocao.create({
            nome,
            descricao,
            imagem,
            preco: parseInt(preco, 10),
        });
        res.status(201).json(nova);
    } catch (e) {
        res.status(400).json({ erro: e.message });
    }
});

// Remover poção
app.delete("/api/pocoes/:id", async (req, res) => {
    const removidos = await Pocao.destroy({ where: { id: req.params.id } });
    if (!removidos) return res.status(404).json({ erro: "Poção não encontrada" });
    res.status(204).end();
});

// POPULAÇÃO INICIAL 
const pocoesIniciais = [
    {
        nome: "Poção Blue Sky",
        descricao:
            "Provê um surto de inspiração por 24 horas. Foi utilizada por John Lennon quando escreveu Lucy in the Sky with Diamonds.",
        imagem: "https://i.ibb.co/ZzS7xb2/rsz-sky.png",
        preco: 300,
    },
    {
        nome: "Poção do Perfume Misterioso",
        descricao:
            "Faz com que você fique cheirando lilás e groselha por 24 dias. Essência muito admirada pelos bruxos.",
        imagem: "https://i.ibb.co/pyhZJXf/rsz-lilas.png",
        preco: 200,
    },
    {
        nome: "Poção de Pinus",
        descricao:
            "Faz com que você fique 10 cm mais alto! Observação: efeitos colaterais desconhecidos.",
        imagem: "https://i.ibb.co/DkzdL1q/rsz-pinus.png",
        preco: 3000,
    },
    {
        nome: "Poção da Beleza Eterna",
        descricao: "Veneno que mata rápido.",
        imagem: "https://i.ibb.co/9p872NK/rsz-1beleza.png",
        preco: 100,
    },
    {
        nome: "Poção do Arco-Íris",
        descricao:
            "Traz felicidade momentânea. Pode durar de 10 minutos a 2 dias.",
        imagem: "https://i.ibb.co/PrC09MP/rsz-2unicornio.png",
        preco: 120,
    },
    {
        nome: "Caldeirão das Verdades Secretas",
        descricao:
            "As pessoas lhe dirão apenas verdades por 1 hora. É necessário beber os 5L.",
        imagem: "https://i.ibb.co/s9Lyvj8/rsz-verdades.png",
        preco: 150,
    },
];

async function iniciar() {
    await sequelize.sync({ force: true });
    await Pocao.bulkCreate(pocoesIniciais);
    app.listen(PORT, () => {
        console.log(`Poções e Soluções rodando em http://localhost:${PORT}`);
        console.log(`Administração em http://localhost:${PORT}/admin.html`);
    });
}

iniciar();
