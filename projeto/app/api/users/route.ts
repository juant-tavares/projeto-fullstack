import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function GET() {
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
        password: false,
      },
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return NextResponse.json({ error: "Erro ao buscar usuários" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, password } = await request.json()
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null

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
        password: false,
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    console.error("Erro ao criar usuário:", err)
    return NextResponse.json({ error: "O email precisa ser único" }, { status: 400 })
  }
}
