import { Ticket } from "../ticket";

it('implements optimistic concurrency control', async(done) => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: '123'
    })

    await ticket.save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    await firstInstance!.set({price: 10})

    try {
        await secondInstance!.set({price: 15})
    } catch (err) {
        return done()
    }

    throw new Error('Should not reach this point')
    

    // expect(async () => {
    //     await secondInstance!.set({price: 15})
    // }).toThrow()

})

it('increment the version number on multiple saves', async () => {

    const ticket = Ticket.build({
        title: 'concert',
        price: 50,
        userId: '123'
    })

    await ticket.save()
    expect(ticket.version).toEqual(0)
    await ticket.save()
    expect(ticket.version).toEqual(1)
    await ticket.save()
    expect(ticket.version).toEqual(2)
})