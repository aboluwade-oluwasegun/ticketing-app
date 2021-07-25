import express from 'express'
import 'express-async-errors'
import mongoose from 'mongoose'
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
    secure: true,
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

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }
     
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('Connected to mongodb')
    } catch (err) {
        console.log(err)
    }
    app.listen(3000, () => {
        console.log('Listening on 3000!')
    })    
}

start()