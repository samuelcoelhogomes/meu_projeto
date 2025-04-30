require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Para permitir requisições do frontend

// 🔹 Conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME // Aqui é DB_NAME
});
db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
        return;
    }
    console.log("Banco de dados conectado!");
});

// 🔹 Rota para inserir um usuário (CREATE)
app.post('/usuarios', (req, res) => {
//Define uma rota POST no caminho /usuarios.
// Essa rota será acionada quando o front-end (ou um cliente como curl, Postman, etc.) 
// enviar uma requisição POST com os dados do usuário.
    const { nome, email } = req.body;
// Extrai os dados enviados no corpo da requisição.
    const sql = "INSERT INTO usuarios (nome, email) VALUES (?, ?)"
//Cria a query SQL para inserir os dados na tabela usuarios.
// Os ? são placeholders usados para evitar SQL Injection (boas práticas de segurança).
    db.query(sql, [nome, email], (err, result) => {
//Executa a query no banco de dados, substituindo os ? por nome e email.
// err conterá erros, se houver algum.
// result terá informações como insertId (o ID gerado automaticamente para o novo usuário)
        if (err) {
            console.error("Erro ao inserir usuário:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        res.json({ message: "Usuário cadastrado com sucesso!", id: result.insertId });
    })
// se err apresentará o erro no console
// se tudo estiver ok irá cadastrar o usuários com os dados inseridos
});

// 🔹 Rota para listar todos os usuários (READ)
app.get('/usuarios', (req, res) => {
// define uma rota get para o caminho /usuarios ou seja quando alguem acessar o localhost essa função será executada
    const sql = "SELECT * FROM usuarios";
// define o comando sql que será executado no mysql
    db.query(sql, (err, results) => {
// usando o metodo query para executar a instrução sql no banco dados 
// db é objeto de conexão com o banco de dados que criamos anteriormente
// err captura qualquer erro durante a execução da query
// results vai conter os dados retornados da tabela
        if (err) {
            console.error("Erro ao buscar usuários:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        res.json(results);
// se err apresentará erro no console 
// se tudo estiver ok, o servidor irá enviar uma reposta com os dados 
    });
});

// 🔹 Rota para atualizar um usuário (UPDATE)
app.put('/usuarios/:id', (req, res) => {
// Define uma rota PUT no caminho /usuarios/:id.
// O :id é um parâmetro dinâmico da URL. Ex: PUT /usuarios/3 vai atualizar o usuário de ID 3.
    const { id } = req.params;
    const { nome, email } = req.body;
//req.params captura o id da URL (Ex: /usuarios/3 → id = 3).
// eq.body pega os novos dados (nome, email) enviados na requisição.

    const sql = "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?";
//Comando SQL para atualizar o usuário cujo id for igual ao passado na URL.
// Os ? são placeholders para evitar SQL Injection.

    db.query(sql, [nome, email, id], (err, result) => {
//Executa a query substituindo os ? por nome, email, e id.
//result.affectedRows vai indicar se algum registro foi alterado.

        if (err) {
            console.error("Erro ao atualizar usuário:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json({ message: "Usuário atualizado com sucesso!" });
    });
// se err irá apresentar os erros de console 
// se ok, 
});

// 🔹 Rota para excluir um usuário (DELETE)
app.delete('/usuarios/:id', (req, res) => {
// Define uma rota HTTP do tipo DELETE.
// O :id é um parâmetro dinâmico na URL (por exemplo: /usuarios/4 → id = 4).

    const { id } = req.params;
//Extrai o valor de id diretamente da URL da requisição.
    const sql = "DELETE FROM usuarios WHERE id = ?";
//Query SQL que deleta um usuário com o id correspondente.
// O ? será substituído de forma segura para evitar SQL Injection.

    db.query(sql, [id], (err, result) => {
//Executa a query e passa o id como parâmetro.
// result.affectedRows indica se algum registro foi de fato deletado.
        if (err) {
            console.error("Erro ao excluir usuário:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json({ message: "Usuário excluído com sucesso!" });
    });
// Se err apresentará erro no console
// se tudo ok, irá excluir o usuário do banco 
});

// 🔹 Iniciar o servidor na porta 3000
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
