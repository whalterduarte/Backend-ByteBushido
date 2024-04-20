import express, { Request, Response } from "express";
import login from "./src/routes/login.routes";
import cursos from "./src/routes/cursos.routes";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
require("dotenv").config();

//Inicia Server
const app = express();
const port = process.env.PORT;

// Servir arquivos estáticos da pasta 'dist'
app.use("/dist",express.static(path.join(__dirname, "dist")));
// Servir arquivos estáticos da pasta 'dist/user'
app.use("/user", express.static(path.join(__dirname, "dist", "user")));


// Configuração do CORS
const corsOptions = {
  origin: "https://cursos.bytebushido.tech",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rotas

//Home
app.use("/", login);
app.use("/cursos", cursos);

//Para rotas não encotradas
app.use((req: Request, res: Response) => {
  res.status(404).json({ Server: "Pagina não encontrada" });
});


app.listen(port, () => {
  console.log(`Servidor rodando em https://api.bytebushido.tech`);
});