const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.MONGODB_URI || 'mongodb://admin:adminpass@sostituirenomecontainer:27017/',
  database: process.env.DB_NAME || 'mydb'
};

// Schema Mongoose
const AccessoSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  info: String
});

const Accesso = mongoose.model('Accesso', AccessoSchema);

const connectionString = dbConfig.host;
console.log('Connessione a MongoDB:', connectionString);
mongoose.connect(connectionString, {
  dbName: dbConfig.database
})
  .then(() => console.log(`Connesso a MongoDB - Database: ${dbConfig.database}`))
  .catch(err => console.error('Errore di connessione MongoDB:', err));

app.get('/', async (req, res) => {
  res.json({
    title: 'Lezione Docker',
    message: 'Hello Students!',
    dbLink: '/db'
  });
});

app.get('/db', async (req, res) => {
  try {
    await Accesso.create({ info: 'Nuovo accesso' });
    
    const accessi = await Accesso.find().sort({ timestamp: -1 });
    
    res.json({
      title: 'Database Connection',
      success: true,
      data: accessi
    });
  } catch (error) {
    console.error('Errore di connessione al database:', error);
    res.status(500).json({
      title: 'Database Error',
      success: false,
      error: error.message
    });
  }
});

app.get('/info', (req, res) => {
  res.json({
    dockerWorkshop: true,
    time: new Date(),
    container: 'node-app'
  });
});

app.get('/info-view', (req, res) => {
  res.json({
    title: 'API Info'
  });
});

app.get('/health', (req, res) => {
  res.json({
    title: 'Health Check',
    status: 'OK'
  });
});

app.get('/health-check', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App in esecuzione su http://localhost:${port}`);
});