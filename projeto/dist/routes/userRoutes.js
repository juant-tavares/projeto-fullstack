"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new prisma_1.PrismaClient();
const router = (0, express_1.Router)();
// GET /api/users
router.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        published: true,
                        createdAt: true,
                    },
                },
                password: false, // Não retornar senha
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).json({ error: "Erro ao buscar usuários" });
    }
});
// GET /api/users/:id
router.get("/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);
        console.log("🔍 Buscando usuário com ID:", userId);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "ID de usuário inválido" });
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        published: true,
                        createdAt: true,
                    },
                },
                password: false, // Não retornar senha
            },
        });
        if (!user) {
            console.log("❌ Usuário não encontrado:", userId);
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        console.log("✅ Usuário encontrado:", user.name);
        res.json(user);
    }
    catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ error: "Erro ao buscar usuário" });
    }
});
// POST /api/users
router.post("/", async (req, res) => {
    const { email, name, password } = req.body;
    try {
        // Hash da senha antes de salvar
        const hashedPassword = password ? await bcrypt_1.default.hash(password, 10) : null;
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: false, // Não retornar senha
            },
        });
        res.status(201).json(user);
    }
    catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(400).json({ error: "O email precisa ser único" });
    }
});
// POST /api/users/login - Função separada para evitar conflito de tipos
const loginHandler = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscar usuário pelo email
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        // Verificar senha
        const validPassword = await bcrypt_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        // Retornar usuário sem a senha
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    }
    catch (err) {
        console.error("Erro ao fazer login:", err);
        res.status(500).json({ error: "Erro ao fazer login" });
    }
};
router.post("/login", loginHandler);
// PUT /api/users/:id - Função separada para evitar conflito de tipos
const updateUserHandler = async (req, res) => {
    const { email, name, password } = req.body;
    const userId = Number(req.params.id);
    try {
        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        // Se tiver senha, fazer hash
        const updateData = { email, name };
        if (password) {
            updateData.password = await bcrypt_1.default.hash(password, 10);
        }
        const user = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                password: false, // Não retornar senha
            },
        });
        res.json(user);
    }
    catch (error) {
        if (error.code === "P2002") {
            res.status(400).json({ error: "Este email já está em uso" });
        }
        else {
            res.status(500).json({ error: "Erro ao atualizar usuário" });
        }
    }
};
router.put("/:id", updateUserHandler);
// DELETE /api/users/:id - Função separada para evitar conflito de tipos
const deleteUserHandler = async (req, res) => {
    const userId = Number(req.params.id);
    try {
        console.log("🗑️ [DELETE] Iniciando deleção do usuário:", userId);
        if (isNaN(userId)) {
            console.log("❌ [DELETE] ID inválido:", req.params.id);
            return res.status(400).json({ error: "ID de usuário inválido" });
        }
        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: true,
                comments: true,
            },
        });
        if (!existingUser) {
            console.log("❌ [DELETE] Usuário não encontrado:", userId);
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        console.log("✅ [DELETE] Usuário encontrado, iniciando deleção:", {
            id: existingUser.id,
            name: existingUser.name,
            posts: existingUser.posts.length,
            comments: existingUser.comments.length,
        });
        // Usar transação para garantir que tudo seja deletado corretamente
        await prisma.$transaction(async (tx) => {
            // Deletar comentários primeiro
            await tx.comment.deleteMany({
                where: { authorId: userId },
            });
            // Deletar posts do usuário
            await tx.post.deleteMany({
                where: { authorId: userId },
            });
            // Finalmente deletar o usuário
            await tx.user.delete({
                where: { id: userId },
            });
        });
        console.log("✅ [DELETE] Usuário deletado com sucesso:", userId);
        return res.status(200).json({
            message: "Usuário deletado com sucesso",
            deletedUser: {
                id: existingUser.id,
                name: existingUser.name,
                postsDeleted: existingUser.posts.length,
                commentsDeleted: existingUser.comments.length,
            },
        });
    }
    catch (error) {
        console.error("❌ [DELETE] Erro ao deletar usuário:", {
            userId,
            error: error.message,
            stack: error.stack,
        });
        return res.status(500).json({
            error: "Erro interno do servidor ao deletar usuário",
            details: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
router.delete("/:id", deleteUserHandler);
exports.default = router;
