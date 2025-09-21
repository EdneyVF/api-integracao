const Report = require('../models/Report');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');

const getReports = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await Report.countDocuments();
  const reports = await Report.find()
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  res.json({
    success: true,
    data: {
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

const createReport = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    date,
    location
  } = req.body;

  if (!title || !description || !date || !location) {
    throw new ErrorResponse('Título, descrição, data e localização são obrigatórios', 400);
  }

  if (title.length < 3 || title.length > 100) {
    throw new ErrorResponse('Título deve ter entre 3 e 100 caracteres', 400);
  }

  if (description.length < 10) {
    throw new ErrorResponse('Descrição deve ter pelo menos 10 caracteres', 400);
  }

  if (typeof location !== 'string' || location.length < 3) {
    throw new ErrorResponse('Localização deve ser uma string com pelo menos 3 caracteres', 400);
  }

  let reportDate;
  try {
    reportDate = new Date(date);
    if (isNaN(reportDate.getTime())) {
      throw new Error();
    }
  } catch (error) {
    throw new ErrorResponse('Formato de data inválido', 400);
  }

  const reportData = {
    title,
    description,
    date: reportDate,
    location
  };

  const report = await Report.create(reportData);

  res.status(201).json({
    success: true,
    message: 'Relato criado com sucesso',
    report
  });
});

const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    throw new ErrorResponse('Relato não encontrado', 404);
  }

  await report.deleteOne();

  res.json({
    success: true,
    message: 'Relato deletado com sucesso'
  });
});

module.exports = {
  getReports,
  createReport,
  deleteReport
};