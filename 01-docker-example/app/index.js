const express = require('express');
const app = express();
const port = 3000;

app.get('/greetings', (req, res) => {
  res.json({ message: "hello world" });
});

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`App in esecuzione su http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('SIGINT CTRL+C received, exiting...');
  process.exit(0);
});
