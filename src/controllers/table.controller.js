const Table = require('../models/Table')
const Order = require('../models/Order')
const Booking = require('../models/Booking')

// CREATE
exports.createTable = async (req, res) => {
    const name = req.body.name.toLowerCase()

    const existing = await Table.findOne({ name })
    if (existing) {
        return res.status(400).json({ message: 'Table already exists' })
    }

    const table = await Table.create({ name })
    res.status(201).json(table)
}

// READ ALL (with status)
exports.getTables = async (req, res) => {
    const tables = await Table.find().sort({ name: 1 })

    const data = tables.map((table) => {
        const isAvailable =
            table.status === 'FREE' && table.isBooked === false

        return {
            id: table._id,
            name: table.name,
            status: table.status,
            isBooked: table.isBooked,
            isAvailable,
            createdAt: table.createdAt,
            updatedAt: table.updatedAt
        }
    })


    res.json({
        success: true,
        count: data.length,
        data
    })
}


// DELETE
exports.deleteTable = async (req, res) => {
    const { id } = req.params

    const table = await Table.findById(id)
    if (!table) {
        return res.status(404).json({ message: 'Table not found' })
    }

    // 🔒 safety 1 — active table
    if (table.status === 'OCCUPIED') {
        return res.status(400).json({
            message: 'Cannot delete table while it is occupied'
        })
    }

    // 🔒 safety 2 — booked table
    if (table.isBooked) {
        return res.status(400).json({
            message: 'Cannot delete a booked table'
        })
    }


    // 🔒 safety 2 — order history
    const orderExists = await Order.exists({ table: table._id })
    if (orderExists) {
        return res.status(400).json({
            message: 'Table has order history and cannot be deleted'
        })
    }

    await table.deleteOne()

    res.json({
        success: true,
        message: 'Table deleted successfully'
    })
}

// BOOK TABLE (ADMIN)
exports.bookTable = async (req, res) => {
    const { id } = req.params

    const table = await Table.findById(id)
    if (!table) {
        return res.status(404).json({ message: 'Table not found' })
    }

    // cannot book if table is occupied
    if (table.status === 'OCCUPIED') {
        return res.status(400).json({
            message: 'Cannot book an occupied table'
        })
    }

    if (table.isBooked) {
        return res.status(400).json({
            message: 'Table is already booked'
        })
    }


    table.isBooked = true
    await table.save()

    res.json({
        success: true,
        message: 'Table booked successfully',
        data: table
    })
}


// UNBOOK TABLE (ADMIN)
// exports.unbookTable = async (req, res) => {
//     const { id } = req.params

//     const table = await Table.findById(id)
//     if (!table) {
//         return res.status(404).json({ message: 'Table not found' })
//     }

//     if (table.status === 'OCCUPIED') {
//         return res.status(400).json({
//             message: 'Cannot unbook table while it is occupied'
//         })
//     }

//     table.isBooked = false
//     await table.save()

//     res.json({
//         success: true,
//         message: 'Table unbooked successfully',
//         data: table
//     })
// }
// UNBOOK TABLE (ADMIN)
// exports.unbookTable = async (req, res) => {
//     const { id } = req.params

//     const table = await Table.findById(id)
//     if (!table) {
//         return res.status(404).json({ message: 'Table not found' })
//     }

//     // 🔒 cannot unbook if table is occupied
//     if (table.status === 'OCCUPIED') {
//         return res.status(400).json({
//             message: 'Cannot unbook table while it is occupied'
//         })
//     }

//     // 🔎 find active booking for this table
//     const booking = await Booking.findOne({
//         table: table._id,
//         status: { $in: ['PENDING', 'ARRIVED'] }
//     })

//     // ❌ arrived booking cannot be manually unbooked
//     if (booking && booking.status === 'ARRIVED') {
//         return res.status(400).json({
//             message: 'Cannot unbook table after customer has arrived'
//         })
//     }

//     // 🧹 cancel pending booking
//     if (booking) {
//         booking.status = 'COMPLETED'
//         await booking.save()
//     }

//     table.isBooked = false
//     await table.save()

//     res.json({
//         success: true,
//         message: 'Table unbooked successfully',
//         data: table
//     })
// }

exports.unbookTable = async (req, res) => {
    const { id } = req.params

    const table = await Table.findById(id)
    if (!table) {
        return res.status(404).json({ message: 'Table not found' })
    }

    // ❌ if order exists, never unbook
    const orderExists = await Order.exists({
        table: table._id,
        status: { $ne: 'COMPLETED' }
    })

    if (orderExists) {
        return res.status(400).json({
            message: 'Cannot unbook table with active order'
        })
    }

    // 🔎 find active booking
    const booking = await Booking.findOne({
        table: table._id,
        status: { $in: ['PENDING', 'ARRIVED'] }
    })

    // 🧹 close booking if exists
    if (booking) {
        booking.status = 'COMPLETED'
        await booking.save()
    }

    table.isBooked = false
    table.status = 'FREE'
    await table.save()

    res.json({
        success: true,
        message: 'Table unbooked successfully',
        data: table
    })
}
