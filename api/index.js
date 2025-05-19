const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware para permitir requisições JSON
app.use(express.json());

// Caminho para o arquivo JSON
const filmesPath = path.join(__dirname, '../filmes.json');

// Função para ler os filmes do arquivo JSON
const getFilmes = () => {
  const data = fs.readFileSync(filmesPath);
  return JSON.parse(data);
};

// Rota para pegar todos os filmes
app.get('/api/filmes', (req, res) => {
  const filmes = getFilmes();
  res.json(filmes);
});

// Rota para pegar um filme específico pelo ID
app.get('/api/filmes/:id', (req, res) => {
  const { id } = req.params;
  const filmes = getFilmes();
  const filme = filmes.find(f => f.id == id);

  if (filme) {
    res.json(filme);
  } else {
    res.status(404).json({ error: "Filme não encontrado" });
  }
});

// Rota para adicionar um novo filme
app.post('/api/filmes', (req, res) => {
  const { titulo, ano, genero } = req.body;
  
  if (!titulo || !ano || !genero) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  const filmes = getFilmes();
  const novoFilme = {
    id: filmes.length + 1,
    titulo,
    ano,
    genero
  };
  
  filmes.push(novoFilme);

  // Escreve de volta no arquivo JSON
  fs.writeFileSync(filmesPath, JSON.stringify(filmes, null, 2));

  res.status(201).json(novoFilme);
});

// Rota para deletar um filme pelo ID
app.delete('/api/filmes/:id', (req, res) => {
  const { id } = req.params;
  let filmes = getFilmes();
  filmes = filmes.filter(f => f.id != id);

  // Escreve de volta no arquivo JSON
  fs.writeFileSync(filmesPath, JSON.stringify(filmes, null, 2));

  res.status(204).send();
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
