const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Report = require('../models/Report');

describe('Reports API', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/api-integracao';
    await mongoose.connect(mongoUri);
  });

  beforeEach(async () => {
    await Report.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/reports', () => {
    it('should return empty list when no reports exist', async () => {
      const response = await request(app)
        .get('/api/reports')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reports).toEqual([]);
      expect(response.body.data.pagination.total).toBe(0);
    });

    it('should return paginated list of reports', async () => {
      // Criar alguns reports para teste
      await Report.create([
        {
          title: 'Report 1',
          description: 'Descrição do report 1',
          date: new Date('2024-12-25'),
          location: 'São Paulo, SP'
        },
        {
          title: 'Report 2',
          description: 'Descrição do report 2',
          date: new Date('2024-12-26'),
          location: 'Rio de Janeiro, RJ'
        }
      ]);

      const response = await request(app)
        .get('/api/reports?page=1&limit=10')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reports).toHaveLength(2);
      expect(response.body.data.pagination.total).toBe(2);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });
  });

  describe('POST /api/reports', () => {
    it('should create a new report with valid data', async () => {
      const reportData = {
        title: 'Teste de relatório',
        description: 'Descrição do teste de relatório',
        date: '2024-12-25',
        location: 'São Paulo, SP'
      };

      const response = await request(app)
        .post('/api/reports')
        .send(reportData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Relato criado com sucesso');
      expect(response.body.report).toHaveProperty('_id');
      expect(response.body.report.title).toBe(reportData.title);
      expect(response.body.report.description).toBe(reportData.description);
      expect(response.body.report.location).toBe(reportData.location);
    });

    it('should return 400 for missing required fields', async () => {
      const invalidData = {
        title: 'Teste'
        // Faltam campos obrigatórios
      };

      const response = await request(app)
        .post('/api/reports')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('obrigatórios');
    });

    it('should return 400 for invalid title length', async () => {
      const invalidData = {
        title: 'AB', // Muito curto
        description: 'Descrição válida com mais de 10 caracteres',
        date: '2024-12-25',
        location: 'São Paulo, SP'
      };

      const response = await request(app)
        .post('/api/reports')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('3 e 100 caracteres');
    });

    it('should return 400 for invalid description length', async () => {
      const invalidData = {
        title: 'Título válido',
        description: 'Curto', // Muito curto
        date: '2024-12-25',
        location: 'São Paulo, SP'
      };

      const response = await request(app)
        .post('/api/reports')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('10 caracteres');
    });

    it('should return 400 for invalid location', async () => {
      const invalidData = {
        title: 'Título válido',
        description: 'Descrição válida com mais de 10 caracteres',
        date: '2024-12-25',
        location: 'SP' // Muito curto
      };

      const response = await request(app)
        .post('/api/reports')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('3 caracteres');
    });
  });

  describe('DELETE /api/reports/:id', () => {
    it('should delete an existing report', async () => {
      // Primeiro cria um report
      const report = await Report.create({
        title: 'Report para deletar',
        description: 'Descrição do report para deletar',
        date: new Date('2024-12-25'),
        location: 'São Paulo, SP'
      });

      const response = await request(app)
        .delete(`/api/reports/${report._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Relato deletado com sucesso');

      // Verifica se foi realmente deletado
      const deletedReport = await Report.findById(report._id);
      expect(deletedReport).toBeNull();
    });

    it('should return 404 for non-existent report', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/reports/${nonExistentId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Relato não encontrado');
    });

    it('should return 500 for invalid ObjectId', async () => {
      const response = await request(app)
        .delete('/api/reports/invalid-id')
        .expect(500); // O mongoose retorna erro 500 para ObjectId inválido

      expect(response.body.success).toBe(false);
    });
  });
});