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

// VWorld 프록시 테스트
app.get('/api/vworld/test', (req, res) => {
  res.json({
    success: true,
    message: 'VWorld proxy route is working'
  });
});

// VWorld WMS 프록시
app.get('/api/vworld/wms', async (req, res) => {
  try {
    const allowedParams = [
      'SERVICE',
      'REQUEST',
      'VERSION',
      'FORMAT',
      'STYLES',
      'TRANSPARENT',
      'LAYERS',
      'CRS',
      'SRS',
      'WIDTH',
      'HEIGHT',
      'BBOX',
      'KEY',
      'DOMAIN',
      'EXCEPTIONS'
    ];

    const query = new URLSearchParams();

    allowedParams.forEach((param) => {
      const value = req.query[param];

      if (value !== undefined && value !== null) {
        query.set(param, String(value));
      }
    });

    const vworldUrl =
      `https://api.vworld.kr/req/wms?${query.toString()}`;

    console.log('[VWorld WMS 요청]', vworldUrl);

    const response = await fetch(vworldUrl);

    const contentType =
      response.headers.get('content-type') ||
      'application/octet-stream';

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    console.log('[VWorld WMS 응답]', {
      status: response.status,
      contentType,
      size: buffer.length
    });

    res.status(response.status);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
    res.end(buffer);

  } catch (error) {
    console.error('[VWorld WMS 프록시 오류]', error);

    res.status(502).json({
      success: false,
      error: 'VWorld WMS 서버와 통신하지 못했습니다.',
      message: error.message
    });
  }
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
