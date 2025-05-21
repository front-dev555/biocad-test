import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'

dotenv.config()

const app = express()
export const prisma = new PrismaClient()

app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', usersRoutes)

export default app
