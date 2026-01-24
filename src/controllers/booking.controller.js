const Booking = require('../models/Booking')
const Table = require('../models/Table')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

// CREATE BOOKING
exports.createBooking = catchAsync(async (req, res, next) => {
    const { table, customerName, membersCount } = req.body

    const tableDoc = await Table.findById(table)
    if (!tableDoc) {
        return next(new AppError('Table not found', 404))
    }

    if (tableDoc.status === 'OCCUPIED' || tableDoc.isBooked) {
        return next(
            new AppError('Table is not available for booking', 400)
        )
    }

    const booking = await Booking.create({
        table,
        customerName,
        membersCount,
        createdBy: req.user._id
    })

    tableDoc.isBooked = true
    await tableDoc.save()

    res.status(201).json({
        success: true,
        data: booking
    })
})

// MARK ARRIVAL
exports.markArrival = catchAsync(async (req, res, next) => {
    const { id } = req.params

    const booking = await Booking.findById(id).populate('table')
    if (!booking) {
        return next(new AppError('Booking not found', 404))
    }

    if (booking.status !== 'PENDING') {
        return next(
            new AppError('Booking already arrived or completed', 400)
        )
    }

    booking.status = 'ARRIVED'
    await booking.save()

    res.json({
        success: true,
        message: 'Customer arrived',
        data: booking
    })
})


// GET ALL BOOKINGS (ADMIN)
exports.getAllBookings = async (req, res) => {
    const bookings = await Booking.find()
        .populate('table', 'name')
        .populate('createdBy', 'name role')
        .sort({ createdAt: -1 })

    const data = bookings.map((booking) => ({
        id: booking._id,
        customerName: booking.customerName,
        membersCount: booking.membersCount,
        status: booking.status,
        table: booking.table
            ? {
                id: booking.table._id,
                name: booking.table.name
            }
            : null,
        createdBy: booking.createdBy
            ? {
                id: booking.createdBy._id,
                name: booking.createdBy.name,
                role: booking.createdBy.role
            }
            : null,
        createdAt: booking.createdAt
    }))

    res.json({
        success: true,
        count: data.length,
        data
    })
}


// GET ACTIVE BOOKINGS
exports.getActiveBookings = async (req, res) => {
    const bookings = await Booking.find({
        status: { $in: ['PENDING', 'ARRIVED'] }
    })
        .populate('table', 'name')
        .sort({ createdAt: 1 })

    const data = bookings.map((booking) => ({
        id: booking._id,
        customerName: booking.customerName,
        membersCount: booking.membersCount,
        status: booking.status,
        table: booking.table
            ? {
                id: booking.table._id,
                name: booking.table.name
            }
            : null,
        createdAt: booking.createdAt
    }))

    res.json({
        success: true,
        count: data.length,
        data
    })
}


// GET SINGLE BOOKING
exports.getBookingById = async (req, res) => {
    const { id } = req.params

    const booking = await Booking.findById(id)
        .populate('table', 'name status isBooked')
        .populate('createdBy', 'name role')

    if (!booking) {
        return res.status(404).json({ message: 'Booking not found' })
    }

    res.json({
        success: true,
        data: {
            id: booking._id,
            customerName: booking.customerName,
            membersCount: booking.membersCount,
            status: booking.status,
            table: booking.table,
            createdBy: booking.createdBy,
            createdAt: booking.createdAt
        }
    })
}

