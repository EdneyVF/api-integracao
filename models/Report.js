const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O título do relato é obrigatório'],
    trim: true,
    minlength: [3, 'O título deve ter no mínimo 3 caracteres'],
    maxlength: [100, 'O título deve ter no máximo 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'A descrição do relato é obrigatória'],
    trim: true,
    minlength: [10, 'A descrição deve ter no mínimo 10 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'A data do relato é obrigatória']
  },
  location: {
    type: String,
    required: [true, 'A localização do relato é obrigatória'],
    trim: true,
    minlength: [3, 'A localização deve ter no mínimo 3 caracteres']
  }
}, {
  timestamps: true
});

reportSchema.index({ date: 1 });
reportSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Report', reportSchema);
