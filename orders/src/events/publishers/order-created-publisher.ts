import { Publisher, OrderCreatedEvent, Subjects } from "@protontix/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}