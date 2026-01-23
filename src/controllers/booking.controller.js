const Booking = require('../models/Booking')
const Table = require('../models/Table')

// CREATE BOOKING (ADMIN)
exports.createBooking = async (req, res) => {
    const { table, customerName, membersCount } = req.body

    const tableDoc = await Table.findById(table)
    if (!tableDoc) {
        return res.status(404).json({ message: 'Table not found' })
    }

    // table must be free & unbooked
    if (tableDoc.status === 'OCCUPIED' || tableDoc.isBooked) {
        return res.status(400).json({
            message: 'Table is not available for booking'
        })
    }

    const booking = await Booking.create({
        table,
        customerName,
        membersCount,
        createdBy: req.user._id
    })

    // 🔒 lock table
    tableDoc.isBooked = true
    await tableDoc.save()

    res.status(201).json({
        success: true,
        data: booking
    })
}


// MARK ARRIVAL (ADMIN / WAITER)
exports.markArrival = async (req, res) => {
    const { id } = req.params

    const booking = await Booking.findById(id).populate('table')
    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
    }

    if (booking.status !== 'PENDING') {
        return res.status(400).json({
            message: 'Booking already arrived or completed'
        })
    }

    booking.status = 'ARRIVED'
    await booking.save()

    res.json({
        success: true,
        message: 'Customer arrived',
        data: booking
    })
}

