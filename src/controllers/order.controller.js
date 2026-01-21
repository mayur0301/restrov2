const Order = require('../models/Order')
const Table = require('../models/Table')
const Dish = require('../models/Dish')
const { ORDER_STATUS } = require('../utils/constants')

// exports.createOrder = async (req, res) => {
//     const { table, items } = req.body

//     if (!items || items.length === 0) {
//         return res.status(400).json({ message: 'Order must contain items' })
//     }

//     const tableDoc = await Table.findById(table)
//     if (!tableDoc) {
//         return res.status(404).json({ message: 'Table not found' })
//     }

//     if (tableDoc.status === 'OCCUPIED') {
//         return res.status(400).json({
//             message: 'Table already has an active order'
//         })
//     }

//     // validate dishes
//     for (const item of items) {
//         const dishExists = await Dish.findById(item.dish)
//         if (!dishExists) {
//             return res.status(404).json({ message: 'Dish not found' })
//         }
//     }

//     const order = await Order.create({
//         table,
//         items,
//         createdBy: req.user._id
//     })

//     // lock table
//     tableDoc.status = 'OCCUPIED'
//     await tableDoc.save()

//     res.status(201).json(order)
// }

exports.createOrder = async (req, res) => {
    const { table, items } = req.body

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain items' })
    }

    const tableDoc = await Table.findById(table)
    if (!tableDoc) {
        return res.status(404).json({ message: 'Table not found' })
    }

    if (tableDoc.status === 'OCCUPIED') {
        return res.status(400).json({
            message: 'Table already has an active order'
        })
    }

    const orderItems = []

    for (const item of items) {
        const dish = await Dish.findById(item.dish)

        if (!dish) {
            return res.status(404).json({ message: 'Dish not found' })
        }

        if (!dish.isAvailable) {
            return res.status(400).json({
                message: `Dish ${dish.name} is not available`
            })
        }

        orderItems.push({
            dishId: dish._id,
            dishName: dish.name,
            unitPrice: dish.price,
            quantity: item.quantity
        })
    }

    const order = await Order.create({
        table,
        items: orderItems,
        createdBy: req.user._id
    })

    tableDoc.status = 'OCCUPIED'
    await tableDoc.save()

    res.status(201).json(order)
}



exports.updateOrderByChef = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findById(id)
    if (!order) {
        return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status === ORDER_STATUS.PENDING && status === ORDER_STATUS.PREPARING) {
        order.status = status
    } else if (
        order.status === ORDER_STATUS.PREPARING &&
        status === ORDER_STATUS.READY
    ) {
        order.status = status
    } else {
        return res.status(400).json({
            message: 'Invalid status transition'
        })
    }

    await order.save()
    res.json(order)
}


exports.completeOrder = async (req, res) => {
    const { id } = req.params

    const order = await Order.findById(id)
    if (!order) {
        return res.status(404).json({ message: 'Order not found' })
    }

    if (order.status !== ORDER_STATUS.READY) {
        return res.status(400).json({
            message: 'Order is not ready to be completed'
        })
    }

    order.status = ORDER_STATUS.COMPLETED
    await order.save()

    // free table
    const table = await Table.findById(order.table)
    if (table) {
        table.status = 'FREE'
        await table.save()
    }

    res.json(order)
}


exports.getOrders = async (req, res) => {
    const filter = {}

    // chef sees only active orders
    if (req.user.role === 'CHEF') {
        filter.status = { $in: ['PENDING', 'PREPARING', 'READY'] }
    }

    const orders = await Order.find(filter)
        .populate('table', 'name')
        .populate('items.dish', 'name price')
        .populate('createdBy', 'name role')

    res.json(orders)
}

