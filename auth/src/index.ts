import { app } from './app'
import mongoose from 'mongoose'

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