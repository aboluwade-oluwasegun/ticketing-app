import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signoutRouter } from './routes/signout'
import { signinRouter } from './routes/signin'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app =express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({
    secure: process.env.NODE_ENV !== 'test',
    signed: false
}))

app.use(currentUserRouter)
app.use(signoutRouter)
app.use(signinRouter)
app.use(signupRouter)

app.all('*', () => {
    throw new NotFoundError()
})

app.use(errorHandler)

export { app }