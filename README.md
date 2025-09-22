# API Integração - Sistema de Comunicação Comunitária

## 1. Objetivo do Trabalho

O **Sistema de Comunicação Comunitária** é uma API REST desenvolvida como projeto acadêmico que tem como objetivo criar uma **plataforma digital de comunicação comunitária**, permitindo que cidadãos da comunidade local possam:

- 📝 **Reportar problemas da comunidade** (infraestrutura, segurança, meio ambiente)
- 📢 **Compartilhar avisos importantes** (reuniões, eventos, alertas)
- 👀 **Visualizar reports de outros moradores** (transparência e informação)
- 🤝 **Fortalecer a comunicação comunitária** (participação cidadã ativa)

### Problema Identificado
Muitas comunidades enfrentam dificuldades de comunicação entre moradores e falta de canais eficientes para reportar problemas locais, resultando em questões não resolvidas e baixa participação cidadã.

### Solução Proposta
Uma API REST que serve como backend para aplicações frontend (web/mobile) onde moradores podem facilmente cadastrar e consultar reports sobre questões da comunidade.

## 2. Descrição Funcional da Solução

### Funcionalidades Principais

**📋 Gestão de Reports Comunitários**
- Cadastro de novos reports pelos cidadãos
- Listagem paginada de todos os reports da comunidade
- Remoção de reports (quando necessário)

**🔍 Tipos de Reports Suportados**
- 🚧 **Problemas de Infraestrutura**: Buracos, calçadas danificadas, sinalizações
- 🚨 **Questões de Segurança**: Iluminação pública, pontos perigosos
- 🌱 **Problemas Ambientais**: Lixo acumulado, vazamentos, poluição
- 📢 **Avisos Comunitários**: Eventos, reuniões, informações gerais

**✅ Validações e Controles**
- Validação de dados obrigatórios (título, descrição, localização)
- Controle de tamanho de conteúdo
- Tratamento robusto de erros
- Paginação para performance

## 3. Arquitetura da API e Diagrama

### Diagrama de Arquitetura

```
┌─────────────┐    HTTP/REST    ┌─────────────┐    MongoDB    ┌─────────────┐
│  FRONTEND   │◄───────────────►│ BACKEND API │◄─────────────►│  DATABASE   │
│             │     (JSON)      │             │   Protocol    │             │
│ • Web App   │                 │ • Express   │               │ • MongoDB   │
│ • Mobile    │                 │ • REST      │               │ • Reports   │
│ • Cidadãos  │                 │ • Node.js   │               │             │
└─────────────┘                 └─────────────┘               └─────────────┘
                                       │
                                       ▼
                               ┌─────────────┐
                               │ MIDDLEWARES │
                               │ • CORS      │
                               │ • Errors    │
                               │ • Validate  │
                               └─────────────┘
```

### Fluxo de Dados

**Criar Report:**
```
Cliente → POST /api/reports → Validação → MongoDB → Resposta 201
```

**Listar Reports:**
```
Cliente → GET /api/reports → Query → MongoDB → Resposta 200 + Paginação
```

**Remover Report:**
```
Cliente → DELETE /api/reports/:id → Busca → MongoDB → Resposta 200
```

### Componentes do Sistema

**Sistema 1: Frontend (Cliente)**
- Aplicação web ou mobile usada pelos cidadãos
- Interface para cadastro e visualização de reports
- Consome a API via requisições HTTP

**Sistema 2: Backend (Servidor)**
- API REST desenvolvida em Node.js + Express.js
- Banco de dados MongoDB para persistência
- Middlewares para tratamento de erros e validações

### Protocolos de Integração
- **HTTP/REST**: Comunicação entre frontend e backend
- **JSON**: Formato de troca de dados
- **MongoDB Protocol**: Comunicação com banco de dados

## 4. Tecnologias Utilizadas

**Backend:**
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web minimalista e flexível
- **MongoDB** - Banco de dados NoSQL orientado a documentos
- **Mongoose** - ODM (Object Data Modeling) para MongoDB

**Ferramentas de Desenvolvimento:**
- **Jest** - Framework de testes unitários
- **Supertest** - Biblioteca para testes de API
- **Nodemon** - Reinicialização automática durante desenvolvimento

## 5. Documentação das Rotas da API

### Endpoints Disponíveis

#### 1. **GET** `/api/reports` - Listar Reports da Comunidade
Lista todos os reports cadastrados pelos moradores com paginação.

**Query Parameters:**
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)

**Exemplo de Uso:**
```bash
GET /api/reports?page=1&limit=5
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "_id": "677123abc456def789",
        "title": "Buraco grande na Rua das Flores",
        "description": "Há um buraco profundo na altura do número 150 que está causando acidentes. Precisa de reparo urgente.",
        "date": "2024-12-20T08:30:00.000Z",
        "location": "Rua das Flores, 150 - Centro",
        "createdAt": "2024-12-20T09:15:00.000Z",
        "updatedAt": "2024-12-20T09:15:00.000Z"
      },
      {
        "_id": "677123abc456def790",
        "title": "Reunião de Moradores - Janeiro 2025",
        "description": "Reunião para discutir melhorias no bairro. Todos os moradores estão convidados. Pauta: segurança e limpeza.",
        "date": "2025-01-15T19:00:00.000Z",
        "location": "Centro Comunitário - Praça Central",
        "createdAt": "2024-12-20T10:30:00.000Z",
        "updatedAt": "2024-12-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 24,
      "pages": 5
    }
  }
}
```

#### 2. **POST** `/api/reports` - Cadastrar Novo Report
Permite que moradores cadastrem novos reports na comunidade.

**Body da Requisição:**
```json
{
  "title": "Iluminação pública queimada",
  "description": "A lâmpada do poste na esquina da Rua A com Rua B está queimada há uma semana, deixando a área escura e perigosa à noite.",
  "date": "2024-12-21",
  "location": "Esquina Rua A com Rua B - Bairro Jardim"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "message": "Relato criado com sucesso",
  "report": {
    "_id": "677123abc456def791",
    "title": "Iluminação pública queimada",
    "description": "A lâmpada do poste na esquina da Rua A com Rua B está queimada há uma semana, deixando a área escura e perigosa à noite.",
    "date": "2024-12-21T00:00:00.000Z",
    "location": "Esquina Rua A com Rua B - Bairro Jardim",
    "createdAt": "2024-12-21T14:22:00.000Z",
    "updatedAt": "2024-12-21T14:22:00.000Z"
  }
}
```

#### 3. **DELETE** `/api/reports/:id` - Remover Report
Remove um report específico da comunidade (quando necessário).

**Exemplo:**
```bash
DELETE /api/reports/677123abc456def791
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Relato deletado com sucesso"
}
```

### Validações e Controles

**Campos Obrigatórios:**
- **Título**: 3-100 caracteres (ex: "Buraco na Rua Principal")
- **Descrição**: mínimo 10 caracteres (detalhes do problema/aviso)
- **Data**: formato válido (YYYY-MM-DD)
- **Localização**: string com mínimo 3 caracteres (endereço ou referência)

**Tratamento de Erros:**
```json
{
  "success": false,
  "message": "Título deve ter entre 3 e 100 caracteres"
}
```

**Códigos de Status HTTP:**
- `200` - Operação realizada com sucesso
- `201` - Report criado com sucesso
- `400` - Dados inválidos ou ausentes
- `404` - Report não encontrado
- `500` - Erro interno do servidor

## 6. Instruções Detalhadas para Postman/Insomnia

### Configuração Inicial

**Base URL:** `http://localhost:3001`

### Collection de Testes - Cenários da Comunidade

#### Cenário 1: Listar Reports da Comunidade
```
GET {{base_url}}/api/reports?page=1&limit=10
Headers: Content-Type: application/json
```

#### Cenário 2: Reportar Problema de Infraestrutura
```
POST {{base_url}}/api/reports
Headers: Content-Type: application/json
Body (JSON):
{
  "title": "Semáforo com defeito no cruzamento principal",
  "description": "O semáforo do cruzamento da Av. Principal com Rua Central está piscando amarelo há 3 dias, causando transtornos no trânsito e risco de acidentes.",
  "date": "2024-12-21",
  "location": "Av. Principal esquina com Rua Central"
}
```

#### Cenário 3: Aviso de Evento Comunitário
```
POST {{base_url}}/api/reports
Headers: Content-Type: application/json
Body (JSON):
{
  "title": "Festa Junina da Comunidade 2025",
  "description": "A tradicional festa junina da nossa comunidade será realizada na praça central. Haverá comidas típicas, quadrilha e bingo. Toda a comunidade está convidada!",
  "date": "2025-06-24",
  "location": "Praça Central - Centro Comunitário"
}
```

#### Cenário 4: Problema Ambiental
```
POST {{base_url}}/api/reports
Headers: Content-Type: application/json
Body (JSON):
{
  "title": "Acúmulo de lixo na Praça das Crianças",
  "description": "Há uma grande quantidade de lixo acumulado ao redor da praça, atraindo insetos e causando mau cheiro. A limpeza não é feita há mais de uma semana.",
  "date": "2024-12-21",
  "location": "Praça das Crianças - Bairro Jardim"
}
```

#### Cenário 5: Remover Report Resolvido
```
DELETE {{base_url}}/api/reports/{id_do_report}
Headers: Content-Type: application/json
```

### Testes de Validação

#### Teste: Dados Inválidos
```
POST {{base_url}}/api/reports
Body (JSON):
{
  "title": "AB", // Muito curto
  "description": "Curto", // Muito curto
  "date": "data-inválida",
  "location": "SP" // Muito curto
}
```
**Resultado Esperado:** Status 400 com mensagens de erro

## 7. Instalação e Configuração

### Pré-requisitos
- **Node.js 18+** - Ambiente de execução
- **MongoDB** - Banco de dados (local ou MongoDB Atlas)
- **npm/yarn** - Gerenciador de pacotes

### Passos de Instalação

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd api-integracao
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   MONGODB_URI=mongodb://localhost:27017/api-integracao
   PORT=3001
   NODE_ENV=development
   ```

4. **Inicie o MongoDB:**
   ```bash
   # MongoDB local
   mongod

   # Ou use MongoDB Atlas (cloud)
   ```

5. **Execute a aplicação:**
   ```bash
   # Desenvolvimento (com auto-reload)
   npm run dev

   # Produção
   npm start
   ```

6. **Acesse a API:**
   ```
   http://localhost:3001/api
   ```

### Testando via cURL

**Listar Reports da Comunidade:**
```bash
curl -X GET "http://localhost:3001/api/reports?page=1&limit=10"
```

**Cadastrar Problema de Infraestrutura:**
```bash
curl -X POST http://localhost:3001/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Poste de luz queimado",
    "description": "O poste de iluminação em frente ao número 245 está sem funcionar há uma semana, deixando a rua escura.",
    "date": "2024-12-21",
    "location": "Rua das Palmeiras, 245 - Centro"
  }'
```

**Remover Report:**
```bash
curl -X DELETE http://localhost:3001/api/reports/677123abc456def789
```

## 8. Testes Unitários

### Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar com verbose
npm test -- --verbose
```

### Cobertura dos Testes

**Endpoints Testados:**
- ✅ **GET /api/reports** - Listagem com paginação
- ✅ **POST /api/reports** - Criação de reports
- ✅ **DELETE /api/reports/:id** - Remoção de reports

**Cenários de Teste:**
- Operações com dados válidos
- Validação de campos obrigatórios
- Validação de tamanhos mínimos/máximos
- Tratamento de erros (400, 404, 500)
- Paginação e metadados
- Persistência no banco de dados

## 9. Cumprimento dos Requisitos Acadêmicos

### ✅ Requisitos Técnicos Obrigatórios:

1. **✅ API integra 2 sistemas distintos**
   - Sistema 1: Frontend (aplicação dos cidadãos)
   - Sistema 2: Backend (API + MongoDB)

2. **✅ 3 endpoints funcionais (mais que os 2 mínimos)**
   - GET /api/reports (listar)
   - POST /api/reports (criar)
   - DELETE /api/reports/:id (remover)

3. **✅ Protocolo REST**
   - HTTP com verbos semânticos
   - Formato JSON para dados
   - Status codes padronizados

4. **✅ Tratamento de erros e exceções**
   - Middleware centralizado de erros
   - Validações de entrada
   - Códigos HTTP apropriados

5. **✅ Teste unitário para cada endpoint**
   - Jest + Supertest
   - Cobertura completa dos 3 endpoints
   - Cenários positivos e negativos

6. **✅ Documentação clara e padronizada**
   - README completo com exemplos
   - Instruções para Postman/Insomnia
   - Casos de uso da comunidade

## 10. Estrutura do Projeto

```
api-integracao/
├── config/
│   └── db.js                  # Conexão MongoDB
├── controllers/
│   └── reportController.js    # Lógica dos endpoints
├── middlewares/
│   └── errorMiddleware.js     # Tratamento de erros
├── models/
│   └── Report.js             # Schema do MongoDB
├── routes/
│   ├── index.js              # Roteador principal
│   └── reportRoutes.js       # Rotas dos reports
├── tests/
│   ├── reports.test.js       # Testes unitários
│   └── setup.js              # Configuração de testes
├── utils/
│   └── errorResponse.js      # Classe de erro customizada
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de configuração
├── server.js                 # Servidor principal
└── package.json              # Dependências e scripts
```

## 11. Equipe de Desenvolvimento

### 👥 Integrantes e Responsabilidades

| Nome | Matrícula | Cargo/Responsabilidade |
|------|-----------|------------------------|
| **Edney Vasconcelos Freitas** | 2326253 | 💻 **Desenvolvimento** |
| **Felipe Sousa da Silva** | 2323817 | 💻 **Criação de Testes** |
| **Mary Ruth de Almeida Freitas Silva** | 2327185 | 🧪 **Criação de Documentação** |
| **Mateus Bruno Trigueiro** | 2325500 | 🧪 **Desenvolvimento** |
| **Raquel Gonçalves do Carmo Santana** | 2326635 | 📚 **Criação de Documentação** |
| **Vitor Samuel da Silva Mendonça** | 2326326 | 📚 **Criação de Testes** |

### 🎯 Distribuição de Responsabilidades

**💻 Desenvolvimento (2 membros)**
- Implementação da API REST e endpoints
- Configuração do banco de dados MongoDB
- Desenvolvimento dos controllers e middlewares
- Estruturação da arquitetura do projeto

**🧪 Criação de Testes (2 membros)**
- Desenvolvimento de testes unitários com Jest
- Criação de cenários de teste para todos os endpoints
- Implementação de testes de validação e tratamento de erros
- Configuração do ambiente de testes

**📚 Criação de Documentação (2 membros)**
- Elaboração do README completo
- Documentação técnica da API
- Guias de instalação e configuração
- Exemplos de uso e casos de teste para Postman

## 12. Impacto Social

Esta API contribui para:
- 🏘️ **Melhoria da Comunicação**: Canal direto entre cidadãos e comunidade
- 🔍 **Transparência**: Todos podem ver os problemas reportados
- 🤝 **Participação Cidadã**: Engajamento ativo dos moradores
- ⚡ **Agilidade**: Resposta rápida a problemas da comunidade
- 📱 **Acessibilidade**: Interface simples via aplicações web/mobile

---