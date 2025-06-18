import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, published, authorId } = await request.json()

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        author: { connect: { id: Number(authorId) } },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Dados inválidos ou autor não encontrado" }, { status: 400 })
  }
}
