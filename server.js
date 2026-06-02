const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
  html = html.replace('__CESIUM_TOKEN__', process.env.CESIUM_TOKEN || '');
  res.send(html);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
