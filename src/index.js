import express from "express";
import { config } from "dotenv";
import mysql2 from 'mysql2';

// import { CorsOptions } from "cors";
// import bodyParser from "body-parser";
// import routes from "./controllers/routes";

// CorsOptions();

config(); // VENDO DO .env

const app = express();

// CONFIGURAÇÃO DAS VARIAVEIS DE AMBIENTE
const port = process.env.PORT || 8000;
const HOST = process.env.HOST;
const USER = process.env.USER;
const PSW = process.env.PSW;
const DATABASE = process.env.DATABASE;


app.use(express.json());
// app.use(CorsOptions())
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/api", routes)

// RODANDO A PORT ONDE ESTA NO .env
app.listen(port, () => {
    console.log(`Ok connection! http://localhost:${port}/`);
});

// pegando elementos
app.get("/", (req, res) => {
    res.send("Logado");
});


export default app;

// conexão com o banco
const db = mysql2.createConnection({
    host: HOST,
    user: USER,
    password: PSW,
    database: DATABASE,
});

app.post("/usuarios", (req, res) => {
    const sql =
        "INSERT  INTO `Usuarios`(`usu_nome`,`usu_email`,`usu_cpf`,`usu_senha`,`usu_rg`,`usu_dt_nascimento`,`usu_telefone`,`usu_celular`,`usu_genero`,`usu_dt_cadastro`,`usu_tipo`,`usu_status`) VALUES (?)";
    const values = [
        "Matheus",
        "matheus@gmail.com",
        "50912545875",
        "teste",
        "456789456789",
        "2000/04/15",
        "18997570036",
        "18991978281",
        "1",
        "2023/08/12",
        "1",
        "3",
    ];

    db.query(sql, (err, data) => {
        if (err) return res.json(err, "Erro aqui");
        return res.json("Adicionado com sucesso");
    });
});

app.get("/usuarios", (req, res) => {
    const slq = "SELECT * FROM usuarios";
    // executar query no bd e retornar os dados para o front-end
    db.query(slq, (err, data) => {
        if (err) return res.json(err, "Erro aqui");
        return res.json(data);
    });
});
app.get("/usuarios/:id", (req, res) => {
    // SELEÇÃO CONFORME O ID PASSADO POR PARAMETROS na url ex: http://localhost:8800/usuarios/9
    const sql = "SELECT * FROM usuarios WHERE usu_id = ?";

    db.query(sql, [req.params.id], (err, data) => {
        // tratamento de erros bem especificos
        if (err) {
            return res.status(500).json({ error: `Erro de retorno do data ${err}` });
        }

        // tratamento de erros bem especificos
        if (data.length === 0) {
            return res.status(404).json({
                errorType: err,
                message: `Não foi possivel localizar usuario`,
                numberUtility: req.params.id,
            });
        }

        return res.json(data[0]);
    });
});