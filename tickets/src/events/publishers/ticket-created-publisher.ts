import { Subjects, Publisher, TicketCreatedEvent} from '@protontix/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}