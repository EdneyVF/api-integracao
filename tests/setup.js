// Configuração global para os testes
require('dotenv').config({ path: '.env.test' });

// Aumenta o timeout para testes que fazem requisições HTTP
jest.setTimeout(10000);