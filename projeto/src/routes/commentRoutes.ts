import { Router } from "express"
import { PrismaClient } from "../../generated/prisma"

const prisma = new PrismaClient()
const router = Router()

// GET /api/comments
router.get("/", async (req, res) => {
  const comments = await prisma.comment.findMany({
    include: {
      author: true,
      post: true,
    },
  })
  res.json(comments)
})

// GET /api/comments/:id
router.get("/:id", async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(req.params.id) },
    include: { author: true, post: true },
  })
  comment ? res.json(comment) : res.status(404).json({ error: "Comentário não encontrado" })
})

// GET comments by post
router.get("/post/:postId", async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { postId: Number(req.params.postId) },
    include: { author: true },
  })
  res.json(comments)
})

// POST /api/comments
router.post("/", async (req, res) => {
  const { content, postId, authorId } = req.body
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: Number(postId) } },
        author: { connect: { id: Number(authorId) } },
      },
    })
    res.status(201).json(comment)
  } catch {
    res.status(400).json({ error: "postId, authorId ou dado inválido" })
  }
})

// PUT /api/comments/:id
router.put("/:id", async (req, res) => {
  const { content } = req.body
  try {
    const comment = await prisma.comment.update({
      where: { id: Number(req.params.id) },
      data: { content },
    })
    res.json(comment)
  } catch {
    res.status(404).json({ error: "Comentário não encontrado" })
  }
})

// DELETE /api/comments/:id
router.delete("/:id", async (req, res) => {
  try {
    await prisma.comment.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: "Comentário excluído" })
  } catch {
    res.status(404).json({ error: "Comentário não encontrado" })
  }
})

export default router