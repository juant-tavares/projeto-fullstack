"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const router = (0, express_1.Router)();
// GET /api/posts
router.get("/", async (req, res) => {
    const posts = await prisma.post.findMany({ include: { author: true } });
    res.json(posts);
});
// GET /api/posts/:id
router.get("/:id", async (req, res) => {
    const post = await prisma.post.findUnique({
        where: { id: Number(req.params.id) },
        include: { author: true },
    });
    post ? res.json(post) : res.status(404).json({ error: "Postagem não encontrada" });
});
// POST /api/posts
router.post("/", async (req, res) => {
    const { title, content, published, authorId } = req.body;
    try {
        const post = await prisma.post.create({
            data: {
                title,
                content,
                published,
                author: { connect: { id: Number(authorId) } },
            },
        });
        res.status(201).json(post);
    }
    catch {
        res.status(400).json({ error: "authorId ou dado inválido" });
    }
});
// PUT /api/posts/:id
router.put("/:id", async (req, res) => {
    const { title, content, published } = req.body;
    try {
        const post = await prisma.post.update({
            where: { id: Number(req.params.id) },
            data: { title, content, published },
        });
        res.json(post);
    }
    catch {
        res.status(404).json({ error: "Postagem não encontrada" });
    }
});
// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
    try {
        await prisma.post.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: "Postagem excluída" });
    }
    catch {
        res.status(404).json({ error: "Postagem não encontrada" });
    }
});
exports.default = router;
