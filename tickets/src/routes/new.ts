import express , { Request, response, Response } from 'express'

const router = express.Router()

router.post('/api/tickets', () => {
    response.send(200)
})

export { router as createTicketRouter }