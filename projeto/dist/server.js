"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("../generated/prisma");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const prisma = new prisma_1.PrismaClient();
const port = 3000;
const aluno = {
    name: "Otávio",
    age: 40,
    disciplines: [],
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3001", "http://localhost:3000"], // Permitir ambas as portas
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
})); // Adicionando CORS para permitir requisições do frontend
app.use(express_1.default.json());
app.use("/api/users", userRoutes_1.default);
app.use("/api/posts", postRoutes_1.default);
app.use("/api/comments", commentRoutes_1.default);
app.get("/", (req, res) => {
    res.json({ status: "OK" });
});
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
