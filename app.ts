import express, {Request, Response}  from "express"
import login from './src/routes/login.routes'
import cursos from './src/routes/cursos.routes'
import bodyParser from 'body-parser'
import path from 'path'


require('dotenv').config()
const app = express()
const port = process.env.PORT



 //Body Parser
 app.use(bodyParser.urlencoded({extended: false}))
 app.use(bodyParser.json())

 //Rotas
   //Home
 app.use('/', login)
 app.use('/cursos', cursos)


//Para rotas não encotradas
app.use((req: Request, res:Response)=>{
  res.status(404).send('Pagina não encontrada')
})

app.listen(port, () => console.log(`Servidor rodando na porta : ${port}!`))

