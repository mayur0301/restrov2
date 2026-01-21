const Table = require('../models/Table')

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
  const tables = await Table.find()
  res.json(tables)
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
exports.deleteTable = async (req, res) => {
  const { id } = req.params

  const table = await Table.findById(id)
  if (!table) {
    return res.status(404).json({ message: 'Table not found' })
  }

  // safety: do not delete occupied table
  if (table.status === 'OCCUPIED') {
    return res.status(400).json({
      message: 'Cannot delete table while occupied'
    })
  }

  await table.deleteOne()
  res.json({ message: 'Table deleted' })
}
