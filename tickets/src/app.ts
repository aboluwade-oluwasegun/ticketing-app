import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@protontix/common'

import { createTicketRouter } from './routes/new'

const app =express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}))

app.use(createTicketRouter )

app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }