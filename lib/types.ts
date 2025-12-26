import { ObjectId } from 'mongodb'

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface User {
  _id: ObjectId
  email: string
  name?: string
  password?: string
  emailVerified?: Date
  image?: string
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  _id: ObjectId
  userId: ObjectId
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export interface Session {
  _id: ObjectId
  sessionToken: string
  userId: ObjectId
  expires: Date
}

export interface Class {
  _id: ObjectId
  title: string
  description?: string
  startDate: Date
  endDate: Date
  capacity: number
  price: number
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  _id: ObjectId
  userId: ObjectId
  classId: ObjectId
  status: BookingStatus
  paymentId?: string
  paymentStatus: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

export interface Service {
  _id: ObjectId
  name: string
  description: string
  price?: number
  createdAt: Date
  updatedAt: Date
}
