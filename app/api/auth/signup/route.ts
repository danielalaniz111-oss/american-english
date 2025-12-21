import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { email, password, name } = body

    if (!email || !password || !name) {
      console.log('Missing fields:', { email: !!email, password: !!password, name: !!name })
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.log('Password too short:', password.length)
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    console.log('Checking for existing user...')
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { message: 'Ya existe un usuario con este correo electrónico' },
        { status: 400 }
      )
    }

    console.log('Hashing password...')
    const hashedPassword = await bcrypt.hash(password, 12)

    console.log('Creating user...')
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    })

    console.log('User created successfully:', user.id)
    return NextResponse.json(
      { message: 'Usuario creado exitosamente', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error.message },
      { status: 500 }
    )
  }
}