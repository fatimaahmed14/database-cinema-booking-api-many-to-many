
const getByScreenId = async (req, res) => {
    const { screenId } = req.params;

    const allSeats = await dbClient.seat.findMany({
        where: {
            screenId: Number(screenId)
        }
    });

    res.json({ data: allSeats });
};

const createTicket = async (req, res) => {
    const {
        screeningId,
        customerId,
        seatIds
    } = req.body;

    const createdTicket = await dbClient.ticket.create({
        data: {
            screeningId: screeningId,
            customerId: customerId
        }
    });

    await dbClient.ticketSeats.createMany({
        data: seatIds.map(id => {
            return {
                seatId: id,
                ticketId: createdTicket.id
            }
        })
    });

    const ticket = await dbClient.ticket.findFirst({
        where: {
            id: createdTicket.id
        },
        include: {
            seats: {
                include: {
                    seat: true
                }
            }
        }
    })

    res.json({ data: ticket });
};

module.exports = {
    getByScreenId,
    createTicket
}