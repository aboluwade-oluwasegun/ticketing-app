import { OrderCreatedEvent, OrderStatus } from "@protontix/common";
import mongoose from 'mongoose'
import { Message  } from "node-nats-streaming";
import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // create instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // save ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: 'asdf'
    })
    await ticket.save()

    // create fake data event
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: 'swgwrgw',
        expiresAt: 'dfwef',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {data, ticket, listener, msg}
}

it('set the userId of the order', async () => {
    const { data, listener, ticket, msg } = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)

})

it('acks the message', async () => {
    const { data, listener, ticket, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket updated event', async () => {
    const { data, listener, ticket, msg } = await setup()

    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

    expect(data.id).toEqual(ticketUpdatedData.orderId)
})