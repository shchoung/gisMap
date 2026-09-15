const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 정적 파일 경로
app.use(express.static(path.join(__dirname, 'public')));

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

    for (const param of allowedParams) {
      if (req.query[param] !== undefined) {
        query.set(param, req.query[param]);
      }
    }

    const vworldUrl =
      `https://api.vworld.kr/req/wms?${query.toString()}`;

    console.log('VWorld WMS 요청:', vworldUrl);

    const response = await fetch(vworldUrl);
    const contentType =
      response.headers.get('content-type') || 'image/png';

    const buffer = await response.arrayBuffer();

    res.status(response.status);
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');
    res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('VWorld WMS proxy error:', error);

    res.status(500).json({
      error: 'VWorld WMS 요청 중 오류가 발생했습니다.',
      detail: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
