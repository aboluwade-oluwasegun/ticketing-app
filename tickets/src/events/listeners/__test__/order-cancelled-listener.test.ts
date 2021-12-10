import { OrderCancelledEvent } from "@protontix/common";
import mongoose from 'mongoose'
import { Message  } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client)

    // save ticket
    const orderId = mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: 'asdf'
    })
    ticket.set({ orderId })
    await ticket.save()

    // create fake data event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { data, ticket, listener, msg, orderId }
}

it('updates the ticket, publishes an event and acks the message', async () => {
    const { data, ticket, listener, msg, orderId } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})