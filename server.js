const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 프로젝트 구조에 맞게 수정
app.use(express.static(path.join(__dirname, 'public')));

// 테스트 라우트
app.get('/api/vworld/test', (req, res) => {
  res.json({
    success: true,
    message: 'VWorld proxy server is working'
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

    console.log('[WMS 요청]', vworldUrl);

    const response = await fetch(vworldUrl);

    const contentType =
      response.headers.get('content-type') || 'application/octet-stream';

    const responseBuffer = Buffer.from(
      await response.arrayBuffer()
    );

    console.log('[VWorld 응답]', {
      status: response.status,
      contentType,
      size: responseBuffer.length
    });

    res.status(response.status);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
    res.end(responseBuffer);

  } catch (error) {
    console.error('[WMS 프록시 오류]', error);

    res.status(502).json({
      success: false,
      error: 'VWorld WMS 서버와 통신하지 못했습니다.',
      message: error.message
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
