const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

/*
 * VWorld WMS 프록시
 *
 * 브라우저
 *   → gismap.onrender.com/api/vworld/wms
 *   → Render 서버
 *   → api.vworld.kr/req/wms
 */
app.get('/api/vworld/wms', async (req, res) => {
  try {
    const query = new URLSearchParams();

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

    allowedParams.forEach((param) => {
      if (req.query[param] !== undefined) {
        query.set(param, req.query[param]);
      }
    });

    const vworldUrl =
      `https://api.vworld.kr/req/wms?${query.toString()}`;

    const response = await fetch(vworldUrl);

    const contentType =
      response.headers.get('content-type') || 'image/png';

    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache');

    res.status(response.status).send(Buffer.from(buffer));
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
