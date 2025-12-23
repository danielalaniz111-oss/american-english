import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb } from '@/lib/db'
import { Role } from '@/lib/types'

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
    const db = await getDb()
    const usersCollection = db.collection('users')

    const existingUser = await usersCollection.findOne({ email })

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
    const now = new Date()
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      name,
      role: Role.USER,
      createdAt: now,
      updatedAt: now,
    })

    console.log('User created successfully:', result.insertedId)
    return NextResponse.json(
      { message: 'Usuario creado exitosamente', userId: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor', error: (error as Error).message },
      { status: 500 }
    )
  }
}
