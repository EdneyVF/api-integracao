require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const routes = require('./routes');

connectDB();
const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization,X-Requested-With",
  credentials: false
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: "API Sistema de Comunicação Comunitária funcionando!" });
});

app.use(routes);

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

module.exports = app;