import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router';
import App from './App';
import path from 'path';
import fs from 'fs';

// asset-manifest.json에서 파일 경로들을 조회
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf-8')
);

const chunks = Object.keys(manifest.files)
  .filter(key => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
  .map(key => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
  .join(''); // 합침

function createPage(root, tags) {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,shrink-to-fit=no"
      />
      <meta name="theme-color" content="#000000" />
      <title>React App</title>
      <link href="${manifest.files['main.css']}" rel="stylesheet" />
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <div id="root">
        ${root}
      </div>
      <script src="${manifest.files['runtime-main.js']}"></script>
      ${chunks}
      <script src="${manifest.files['main.js']}"></script>
    </body>
    </html>
      `;
}
const app = express();

// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = (req, res, next) => {
  // 404를 띄워야 할 상황에 404 에러 대신 서버 사이드 렌더링을 하는 함수

  const context = {};

  /**
   * StaticRouter 컴포넌트
   * 주로 서버 사이드 렌더링 용도로 사용되는 라우터 컴포넌트
   */
  const jsx = (
    <StaticRouter
      // location에 넣는 값에 따라 라우팅한다.
      location={req.url} // req 객체는 요청에 대한 정보를 가지고 있다.
      // context 값을 사용해 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정할 수 있다.
      context={context}>
      <App />
    </StaticRouter>
  );

  const root = ReactDOMServer.renderToString(jsx); // 렌더링
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답한다.
};

const serve = express.static(path.resolve('./build'), {
  index: false, // "/" 경로에서 index.html을 보여주지 않도록 설정한다.
});

// app.use: 순서가 중요하다.
app.use(serve);
app.use(serverRender);

// 5000 포트로 서버를 가동한다.
app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
});

/**
 * renderToString 함수
 * JSX를 넣어서 호출하면 렌더링 결과를 문자열로 반환한다.
 const html = ReactDOMServer.renderToString(
   <div>Hello server Side Rendering!</div>
   );
   
console.log(html);
*/
