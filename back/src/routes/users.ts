import { Router } from 'express'
import { prisma } from '../app'
import { authenticateToken } from '../middleware/auth'

const router = Router()

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, createdAt: true },
    })
    res.json(users)
  } catch (err) {
    const error = err as Error
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

export default router
