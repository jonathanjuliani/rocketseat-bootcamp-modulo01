const express = require("express");
const server = express();
server.use(express.json());

//Query params: ?teste=1
//Route params: /users/1
//Request body: { name: teste }

//utilizando middlewares
server.use((req, res, next) => {
  //verificando tempo de exec
  console.time("Interceptor");
  console.log(`Método: ${req.method}; Url: ${req.url}`);
  next();
  console.timeEnd("Interceptor");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Nome de usuário é obrigatório." });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "Usuário não existe." });
  }

  req.user = user;
  return next();
}

const users = ["Jonathan", "Diego", "Joao Dolar"];

//listar todos os usuarios
server.get("/users", (req, res) => {
  return res.json(users);
});

//listar usuarios por id (index)
server.get("/users/:id", checkUserInArray, (req, res) => {
  //recuperando query params
  // const nome = req.query.nome;
  //recuperando route params
  // const id = req.params.id;
  // const { id } = req.params;
  // res.json(users[id]);
  res.json(req.user);
});

//incluir usuario
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

//alterar usuario
server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;
  res.json(users);
});

//deletar usuario
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  res.json(users);
});

server.listen(3000);
