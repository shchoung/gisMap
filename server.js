const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일
app.use(express.static(path.join(__dirname, 'public')));

// 토큰을 서버에서 주입
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');
  const token = process.env.CESIUM_TOKEN || '';
  html = html.replace('__CESIUM_TOKEN__', token);
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Disaster Sim running on port ${PORT}`);
});
