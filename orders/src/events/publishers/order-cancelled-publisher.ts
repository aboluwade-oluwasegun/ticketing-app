import { Publisher, OrderCancelledEvent, Subjects } from "@protontix/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}