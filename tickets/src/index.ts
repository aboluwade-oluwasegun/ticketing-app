import { app } from './app'
import mongoose from 'mongoose'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }

    if(!process.env.NATS_URL) {
        throw new Error('NATS URL must be defined')
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS Cluster Id must be defined')
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS Client Id must be defined')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined')
    }
     
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID, 
            process.env.NATS_CLIENT_ID, 
            process.env.NATS_URL
        )
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())

        await mongoose.connect(process.env.MONGO_URI, {
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