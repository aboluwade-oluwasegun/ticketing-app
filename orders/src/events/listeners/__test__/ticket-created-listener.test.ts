import { TicketCreatedEvent } from "@protontix/common"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming"
import { TicketCreatedListener } from "../ticket-created-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)

    // fake data
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }

    // fake message
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, listener, msg }
}

it('creates and saves a ticket', async () => {
    const { data, listener, msg } =  await setup()

    await listener.onMessage(data, msg)

    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)

    
})

it('it acks the message', async () => {
    const { data, listener, msg } =  await setup()
 
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})