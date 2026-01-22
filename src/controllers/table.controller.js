const Table = require('../models/Table')
const Order = require('../models/Order')

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
// exports.getTables = async (req, res) => {
//   const tables = await Table.find()
//   res.json(tables)
// }
exports.getTables = async (req, res) => {
    const tables = await Table.find().sort({ name: 1 })

    const data = tables.map((table) => ({
        id: table._id,
        name: table.name,
        status: table.status,
        isAvailable: table.status === 'FREE',
        createdAt: table.createdAt,
        updatedAt: table.updatedAt
    }))

    res.json({
        success: true,
        count: data.length,
        data
    })
}


// UPDATE (only name, NOT status)
exports.updateTable = async (req, res) => {
    const { id } = req.params
    const name = req.body.name?.toLowerCase()

    const table = await Table.findById(id)
    if (!table) {
        return res.status(404).json({ message: 'Table not found' })
    }

    if (name) {
        table.name = name
    }

    await table.save()
    res.json(table)
}

// DELETE
// exports.deleteTable = async (req, res) => {
//     const { id } = req.params

//     const table = await Table.findById(id)
//     if (!table) {
//         return res.status(404).json({ message: 'Table not found' })
//     }

//     // safety: do not delete occupied table
//     if (table.status === 'OCCUPIED') {
//         return res.status(400).json({
//             message: 'Cannot delete table while occupied'
//         })
//     }

//     await table.deleteOne()
//     res.json({ message: 'Table deleted' })
// }

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
