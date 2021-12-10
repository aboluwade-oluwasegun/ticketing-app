import { Listener, OrderCancelledEvent, Subjects } from "@protontix/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled  

    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        //find the ticket
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket) {
            throw new Error('Ticket not found!')
        }

        //mark ticket as unreserved
        ticket.set({ orderId: undefined })

        await ticket.save()
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })

        msg.ack()
    }
}