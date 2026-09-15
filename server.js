const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON 요청 처리
app.use(express.json());

// public/index.html 정적 서비스
app.use(express.static(path.join(__dirname, 'public')));

// 서버 상태 확인
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running'
  });
});

// SPA fallback
// API 라우트보다 반드시 아래에 위치해야 함
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Render에서 외부 접속 가능하도록 0.0.0.0 사용
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
