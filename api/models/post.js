const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  content: {
    type: String,
    min: 10
  },
  emotion: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = schema
