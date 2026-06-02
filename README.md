# 🌊 기상재난 시뮬레이터

CesiumJS + Open-Meteo API 기반 실시간 기상재난 시뮬레이션 웹앱

## 재난 유형
- 🌊 홍수·침수 확산
- 🔥 산불·화재 번짐
- 🌀 태풍·강풍 경로
- ❄️ 한파·폭설

## 로컬 실행

```bash
npm install
CESIUM_TOKEN=your_token_here npm start
```

브라우저에서 `http://localhost:3000` 접속

## Render 배포

1. 이 레포를 GitHub에 push
2. [render.com](https://render.com) → New Web Service → 레포 연결
3. 환경변수 설정: `CESIUM_TOKEN` = Cesium Ion 토큰
4. Build Command: `npm install`
5. Start Command: `npm start`

## Cesium Ion 토큰 발급

[cesium.com/ion](https://cesium.com/ion/signup) 에서 무료 가입 후 Access Tokens에서 발급
