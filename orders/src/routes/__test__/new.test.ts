import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order' 
import { Ticket } from '../../models/ticket' 
import { natsWrapper } from '../../nats-wrapper'

it('returns an error if the ticket does not exist', async () => {
    const ticketId = mongoose.Types.ObjectId()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId})
        .expect(404 )
})

it('returns an error if the ticket if the ticket is already reserved', async () => {
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 40
    })
    await ticket.save()

    const order = await Order.build({
        ticket,
        userId: 'assfad',
        status: OrderStatus.Created,
        expiresAt: new Date()
    })
    await order.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin()) 
        .send({ticketId: ticket.id})
        .expect(400)
})

it('it reserves a ticket', async () => {
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 40
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin()) 
        .send({ticketId: ticket.id})
        .expect(201)

})

it('emits an order created event', async () => {
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 40
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin()) 
        .send({ticketId: ticket.id})
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})