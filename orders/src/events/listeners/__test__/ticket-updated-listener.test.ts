import { TicketUpdatedEvent } from "@protontix/common"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
    const listener = new TicketUpdatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    })
    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'new concert',
        price: 99,
        userId: 'asdfg',
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
    const { listener, data, msg, ticket } =  await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.title).toEqual(data.title)
})

it('acks the message', async () => {
    const { listener, data, msg, ticket } =  await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

// version is out of order
it('does not call ack if the event is in the future', async () => {
    const { msg, data, listener, ticket } = await setup()

    data.version = 10

    try {
        await listener.onMessage(data, msg)
    } catch (err) {

    }

    expect(msg.ack).not.toHaveBeenCalled()

})