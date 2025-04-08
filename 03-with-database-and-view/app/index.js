const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const port = 3000;

const dbConfig = {
  host: process.env.DB_HOST || '172.17.0.2',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'workshop'
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.render('home', {
    title: 'Docker Workshop',
    message: 'Hello Docker Workshop!',
    dbLink: '/db'
  });
});

app.get('/db', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accessi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        info VARCHAR(255)
      )
    `);
    
    await connection.execute(`
      INSERT INTO accessi (info) VALUES ('Nuovo accesso')
    `);
    
    const [rows] = await connection.execute('SELECT * FROM accessi ORDER BY timestamp DESC');
    
    await connection.end();
    
    res.render('database', {
      title: 'Database Connection',
      success: true,
      rows: rows
    });
  } catch (error) {
    console.error('Errore di connessione al database:', error);
    res.render('database', {
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
  res.render('info', {
    title: 'API Info'
  });
});

app.get('/health', (req, res) => {
  res.render('health', {
    title: 'Health Check'
  });
});

app.get('/health-check', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`App in esecuzione su http://localhost:${port}`);
});