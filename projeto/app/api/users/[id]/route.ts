import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuário inválido" }, { status: 400 })
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
        password: false,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { email, name, password } = await request.json()
    const userId = Number(params.id)

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const updateData: any = { email, name }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
      },
    })

    return NextResponse.json(user)
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Este email já está em uso" }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number(params.id)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID de usuário inválido" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        comments: true,
      },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.comment.deleteMany({
        where: { authorId: userId },
      })

      await tx.post.deleteMany({
        where: { authorId: userId },
      })

      await tx.user.delete({
        where: { id: userId },
      })
    })

    return NextResponse.json({
      message: "Usuário deletado com sucesso",
      deletedUser: {
        id: existingUser.id,
        name: existingUser.name,
        postsDeleted: existingUser.posts.length,
        commentsDeleted: existingUser.comments.length,
      },
    })
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao deletar usuário",
      },
      { status: 500 },
    )
  }
}
