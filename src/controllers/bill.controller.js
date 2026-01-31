const Bill = require('../models/Bill')
const Order = require('../models/Order')
const Table = require('../models/Table')
const Booking = require('../models/Booking')
const { ORDER_STATUS } = require('../utils/constants')

exports.createBill = async (req, res) => {
    const { tableId } = req.body

    if (!tableId) {
        return res.status(400).json({ message: 'tableId is required' })
    }

    const order = await Order.findOne({
        table: tableId,
        status: ORDER_STATUS.COMPLETED
    })

    if (!order) {
        return res.status(400).json({
            message: 'No completed order found for this table'
        })
    }

    const existingBill = await Bill.findOne({ order: order._id })
    if (existingBill) {
        return res.status(400).json({
            message: 'Bill already exists for this order'
        })
    }

    let totalAmount = 0

    const items = order.items.map(item => {
        const subtotal = item.unitPrice * item.quantity
        totalAmount += subtotal

        return {
            dishId: item.dishId,
            dishName: item.dishName,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            subtotal
        }
    })

    const bill = await Bill.create({
        order: order._id,
        table: tableId,
        items,
        totalAmount,
        createdBy: req.user._id
    })

    // const table = await Table.findById(tableId)
    // if (table) {
    //     table.status = 'FREE'
    //     table.isBooked = false
    //     await table.save()
    // }

    const booking = await Booking.findOne({
        table: tableId,
        status: 'ARRIVED'
    })

    if (booking) {
        booking.status = 'COMPLETED'
        await booking.save()
    }

    res.status(201).json(bill)
}

exports.payBill = async (req, res) => {
    const { id } = req.params
    const { paymentMethod } = req.body

    if (!paymentMethod) {
        return res.status(400).json({ message: 'paymentMethod is required' })
    }

    const bill = await Bill.findById(id)
    if (!bill) {
        return res.status(404).json({ message: 'Bill not found' })
    }

    if (bill.status !== 'CREATED') {
        return res.status(400).json({
            message: 'Bill is not payable in current state'
        })
    }

    bill.status = 'PAID'
    bill.paymentMethod = paymentMethod
    bill.paidAt = new Date()

    await bill.save()

    res.json(bill)
}


// const buildBillView = async (bill) => {
//   const order = await Order.findById(bill.order)
//   const table = await Table.findById(bill.table)

//   let subTotal = 0
//   const items = order.items.map((i) => {
//     const subtotal = i.unitPrice * i.quantity
//     subTotal += subtotal
//     return {
//       dishName: i.dishName,
//       quantity: i.quantity,
//       unitPrice: i.unitPrice,
//       subtotal
//     }
//   })

//   const serviceCharge = 0
//   const taxAmount = 0
//   const grandTotal = subTotal + serviceCharge + taxAmount

//   return {
//     id: bill._id,
//     billNumber: bill.billNumber || `BILL-${bill._id.toString().slice(-6)}`,
//     tableName: table?.name,
//     status: bill.status,
//     paymentMethod: bill.paymentMethod || null,
//     items,
//     summary: {
//       subTotal,
//       serviceCharge,
//       taxAmount,
//       grandTotal
//     },
//     createdAt: bill.createdAt,
//     paidAt: bill.paidAt || null
//   }
// }

const RESTAURANT = {
    name: 'FoodY Restaurant',
    address: 'Pune, Maharashtra',
    phone: '+91-9999999999'
}

const TAX = {
    name: 'GST',
    percentage: 5
}

const buildBillView = async (bill) => {
    const order = await Order.findById(bill.order)
    const table = await Table.findById(bill.table)

    let subTotal = 0
    const items = order.items.map((i) => {
        const subtotal = i.unitPrice * i.quantity
        subTotal += subtotal
        return {
            dishName: i.dishName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            subtotal
        }
    })

    const serviceCharge = 0
    const taxAmount = (subTotal * TAX.percentage) / 100
    const grandTotal = subTotal + serviceCharge + taxAmount

    return {
        id: bill._id,
        billNumber: bill.billNumber || `BILL-${bill._id.toString().slice(-6)}`,

        restaurant: RESTAURANT,

        table: {
            id: table._id,
            name: table.name
        },

        items,

        summary: {
            subTotal,
            serviceCharge,
            tax: {
                name: TAX.name,
                percentage: TAX.percentage,
                amount: taxAmount
            },
            grandTotal
        },

        status: bill.status,
        paymentMethod: bill.paymentMethod || null,
        paidAt: bill.paidAt || null,

        createdAt: bill.createdAt
    }
}


exports.getActiveBills = async (req, res) => {
    const bills = await Bill.find({
        status: { $ne: 'INVOICED' }
    }).sort({ createdAt: -1 })

    const data = []
    for (const bill of bills) {
        data.push(await buildBillView(bill))
    }

    res.json({
        success: true,
        count: data.length,
        data
    })
}

exports.getBillById = async (req, res) => {
    const bill = await Bill.findById(req.params.id)
    if (!bill) {
        return res.status(404).json({ message: 'Bill not found' })
    }

    const view = await buildBillView(bill)
    res.json(view)
}

