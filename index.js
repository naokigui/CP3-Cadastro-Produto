const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let produtos = [
  {
    id: uuidv4(),
    nome: 'Camiseta Básica',
    descricao: 'Camiseta 100% algodão',
    preco: 49.90,
    quantidade: 100,
    categoria: 'Vestuário',
    criadoEm: new Date().toISOString()
  },
  {
    id: uuidv4(),
    nome: 'Tênis Esportivo',
    descricao: 'Ideal para corridas e academia',
    preco: 299.90,
    quantidade: 30,
    categoria: 'Calçados',
    criadoEm: new Date().toISOString()
  }
];

// ─────────────────────────────────────────────
// GET / — Healthcheck
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'API Produtos rodando ✅', versao: '1.0.0' });
});

// ─────────────────────────────────────────────
// GET /produtos — Lista todos os produtos
// ─────────────────────────────────────────────
app.get('/produtos', (req, res) => {
  res.status(200).json({
    sucesso: true,
    total: produtos.length,
    dados: produtos
  });
});

// ─────────────────────────────────────────────
// GET /produtos/:id — Busca um produto pelo ID
// ─────────────────────────────────────────────
app.get('/produtos/:id', (req, res) => {
  const produto = produtos.find(p => p.id === req.params.id);
  if (!produto) {
    return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
  }
  res.status(200).json({ sucesso: true, dados: produto });
});

// ─────────────────────────────────────────────
// POST /produtos — Cadastra um novo produto
// ─────────────────────────────────────────────
app.post('/produtos', (req, res) => {
  const { nome, descricao, preco, quantidade, categoria } = req.body;

  if (!nome || preco === undefined) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Os campos "nome" e "preco" são obrigatórios.'
    });
  }

  const novoProduto = {
    id: uuidv4(),
    nome,
    descricao: descricao || '',
    preco: parseFloat(preco),
    quantidade: parseInt(quantidade) || 0,
    categoria: categoria || 'Geral',
    criadoEm: new Date().toISOString()
  };

  produtos.push(novoProduto);
  res.status(201).json({ sucesso: true, dados: novoProduto });
});

// ─────────────────────────────────────────────
// PUT /produtos/:id — Atualiza um produto
// ─────────────────────────────────────────────
app.put('/produtos/:id', (req, res) => {
  const index = produtos.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
  }

  const { nome, descricao, preco, quantidade, categoria } = req.body;

  produtos[index] = {
    ...produtos[index],
    nome: nome ?? produtos[index].nome,
    descricao: descricao ?? produtos[index].descricao,
    preco: preco !== undefined ? parseFloat(preco) : produtos[index].preco,
    quantidade: quantidade !== undefined ? parseInt(quantidade) : produtos[index].quantidade,
    categoria: categoria ?? produtos[index].categoria,
    atualizadoEm: new Date().toISOString()
  };

  res.status(200).json({ sucesso: true, dados: produtos[index] });
});

// ─────────────────────────────────────────────
// DELETE /produtos/:id — Remove um produto
// ─────────────────────────────────────────────
app.delete('/produtos/:id', (req, res) => {
  const index = produtos.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado.' });
  }

  const removido = produtos.splice(index, 1)[0];
  res.status(200).json({ sucesso: true, mensagem: 'Produto removido com sucesso.', dados: removido });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
