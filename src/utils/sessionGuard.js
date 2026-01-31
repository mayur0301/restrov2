const Order = require('../models/Order')
const Bill = require('../models/Bill')
const { ORDER_STATUS } = require('./constants')

/**
 * Blocks order creation if a table has an OPEN dining session.
 */
async function assertNoOpenSessionForTable(tableId) {

    // 1️⃣ Active order → customer still dining
    const activeOrder = await Order.findOne({
        table: tableId,
        status: {
            $in: [
                ORDER_STATUS.PENDING,
                ORDER_STATUS.PREPARING,
                ORDER_STATUS.READY
            ]
        }
    })

    if (activeOrder) {
        const err = new Error(
            'Cannot place order: table already has an active order'
        )
        err.statusCode = 400
        throw err
    }

    // 2️⃣ Order completed but bill not created yet
    const completedOrder = await Order.findOne({
        table: tableId,
        status: ORDER_STATUS.COMPLETED
    })

    if (completedOrder) {
        const billForOrder = await Bill.findOne({
            order: completedOrder._id
        })

        if (!billForOrder) {
            const err = new Error(
                'Cannot place order: billing is pending for this table'
            )
            err.statusCode = 400
            throw err
        }

        // 3️⃣ Bill exists but session not closed yet
        if (billForOrder.status !== 'INVOICED') {
            const err = new Error(
                'Cannot place order: billing/payment is still in progress'
            )
            err.statusCode = 400
            throw err
        }
    }

    // ✅ If we reach here → session is fully closed, new order allowed
}

module.exports = { assertNoOpenSessionForTable }
