import dotenv from "dotenv"
dotenv.config()

import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import { PrismaClient } from "../generated/prisma"

import userRoutes from "./routes/userRoutes"
import postRoutes from "./routes/postRoutes"
import commentRoutes from "./routes/commentRoutes"

const prisma = new PrismaClient()
const port: number = 3000

type Discipline = {
  name: string
  professor: string
  semestre?: number
}

interface Aluno {
  name: string
  age: number
  disciplines: Array<Discipline>
}

const aluno: Aluno = {
  name: "Otávio",
  age: 40,
  disciplines: [],
}

const app: Express = express()
app.use(
  cors({
    origin: ["http://localhost:3001", "http://localhost:3000"], // Permitir ambas as portas
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
) // Adicionando CORS para permitir requisições do frontend
app.use(express.json())

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "OK" })
})

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
