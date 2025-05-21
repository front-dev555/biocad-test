import { Router, Request, Response } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../app'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  if (!req.body) {
    res.status(400).json({ message: 'Email and password required' })
    return
  }
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password required' })
    return
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' })
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message })
    } else {
      res.status(500).json({ message: 'Server error', error: String(err) })
    }
  }
})

router.post('/login', async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Email and password required' })
    return
  }
  const { email, password } = req.body
  if (!email || !password) {
     res.status(400).json({ message: 'Email and password required' })
     return
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
       res.status(401).json({ message: 'Invalid credentials' })
       return
    }
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'JWT secret is not set' })
      return
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )
    const refreshToken = crypto.randomBytes(64).toString('hex')
    const refreshTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 дней
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, refreshTokenExpiresAt },
    })
    res.json({ token, refreshToken })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message })
    } else {
      res.status(500).json({ message: 'Server error', error: String(err) })
    }
  }
})

router.post('/refresh', async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Refresh token required' })
    return
  }
  const { refreshToken } = req.body
  if (!refreshToken) {
     res.status(400).json({ message: 'Refresh token required' })
     return
  }
  try {
    const user = await prisma.user.findFirst({ where: { refreshToken } })
    if (!user) {
       res.status(401).json({ message: 'Invalid refresh token' })
       return
    }
    if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
      res.status(401).json({ message: 'Refresh token expired' })
      return
    }
    if (!process.env.JWT_SECRET) {
       res.status(500).json({ message: 'JWT secret is not set' })
       return
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )
    res.json({ token })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message })
    } else {
      res.status(500).json({ message: 'Server error', error: String(err) })
    }
  }
})

router.post('/logout', async (req, res) => {
  if (!req.body) {
    res.status(400).json({ message: 'Refresh token required' })
    return
  }
  const { refreshToken } = req.body
  if (!refreshToken) {
    res.status(400).json({ message: 'Refresh token required' })
    return
  }
  try {
    await prisma.user.updateMany({
      where: { refreshToken },
      data: { refreshToken: null },
    })
    res.json({ message: 'Logged out' })
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message })
    } else {
      res.status(500).json({ message: 'Server error', error: String(err) })
    }
  }
})

export default router
