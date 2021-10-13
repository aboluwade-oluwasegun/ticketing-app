import { Subjects, Publisher, TicketUpdatedEvent} from '@protontix/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}