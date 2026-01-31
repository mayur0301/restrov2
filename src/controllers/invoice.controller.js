const Invoice = require('../models/Invoice')
const Bill = require('../models/Bill')
const Table = require('../models/Table')

exports.generateInvoice = async (req, res) => {
    const { billId } = req.body

    if (!billId) {
        return res.status(400).json({ message: 'billId is required' })
    }

    const bill = await Bill.findById(billId)
    if (!bill) {
        return res.status(404).json({ message: 'Bill not found' })
    }

    // 🔒 must be paid
    if (bill.status !== 'PAID') {
        return res.status(400).json({
            message: 'Invoice can be generated only after payment'
        })
    }

    // ♻️ idempotent
    const existingInvoice = await Invoice.findOne({ bill: bill._id })
    if (existingInvoice) {
        return res.json(existingInvoice)
    }

    const invoice = await Invoice.create({
        bill: bill._id,
        table: bill.table,
        totalAmount: bill.totalAmount,
        generatedBy: req.user._id
    })

    // ✅ close session
    bill.status = 'INVOICED'
    await bill.save()

    // ✅ free table ONLY HERE
    const table = await Table.findById(bill.table)
    if (table) {
        table.status = 'FREE'
        table.isBooked = false
        await table.save()
    }

    res.status(201).json(invoice)
}


exports.getInvoices = async (req, res) => {
    const invoices = await Invoice.find().sort({ createdAt: -1 })
    res.json({
        success: true,
        count: invoices.length,
        data: invoices
    })
}

exports.getInvoiceById = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
    if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' })
    }
    res.json(invoice)
}
