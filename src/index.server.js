import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router';
import App from './App';
import path from 'path';
import fs from 'fs';
import { applyMiddleware, createStore } from 'redux';
import rootReducer, { rootSaga } from './modules';
import thunk from 'redux-thunk';
import PreloadContext from './lib/PreloadContext';
import { Provider } from 'react-redux';
import createSagaMiddleware, { END } from '@redux-saga/core';

// asset-manifest.json에서 파일 경로들을 조회
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf-8')
);

const chunks = Object.keys(manifest.files)
  .filter(key => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
  .map(key => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
  .join(''); // 합침

function createPage(root, stateScript) {
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
      ${stateScript}
      <script src="${manifest.files['runtime-main.js']}"></script>
      ${chunks}
      <script src="${manifest.files['main.js']}"></script>
    </body>
    </html>
      `;
}

const app = express();

// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = async (req, res, next) => {
  // 404를 띄워야 할 상황에 404 에러 대신 서버 사이드 렌더링을 하는 함수

  const context = {};

  // saga
  const sagaMiddleware = createSagaMiddleware();

  // 서버에서 리덕스 설정 (브라우저에서 할 때와 큰 차이 없다.)
  const store = createStore(
    rootReducer,
    applyMiddleware(thunk, sagaMiddleware)
  );

  /**
   * toPromise는 sagaMiddleware.run을 통해 만든 Task를 Promise로 변환
   * 우리가 만든 루트 사가에서 액션을 끝없이 모니터링하기 때문에, 별도의 작업을 하지 않으면 이 Promise는 끝나지 않는다.
   * END 액션을 발생시키면 이 Promise를 끝낼 수 있다.
   */
  const sagaPromise = sagaMiddleware.run(rootSaga).toPromise();

  // PreloadContext를 사용해 프로미스들을 수집하고 기다렸다가 다시 렌더링
  const preloadContext = {
    done: false,
    promises: [],
  };

  /**
   * StaticRouter 컴포넌트
   * 주로 서버 사이드 렌더링 용도로 사용되는 라우터 컴포넌트
   */
  const jsx = (
    <PreloadContext.Provider value={preloadContext}>
      <Provider store={store}>
        <StaticRouter
          // location에 넣는 값에 따라 라우팅한다.
          location={req.url} // req 객체는 요청에 대한 정보를 가지고 있다.
          // context 값을 사용해 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정할 수 있다.
          context={context}>
          <App />
        </StaticRouter>
      </Provider>
    </PreloadContext.Provider>
  );

  /* 첫 번째 렌더링 -------------------------------- */
  /** renderToStaticMarkup
   * 리액트를 사용하여 정적인 페이지를 만들 때 사용
   * 이 함수로 만든 리액트 렌더링 결과물은 클라이언트 쪽에서 HTML DOM 인터랙션을 지원하기 어렵다
   * 이 함수를 사용하는 이유는 Preloader로 넣은 함수를 호출하기 위함이다.
   * renderToString보다 renderToStaticMarkup가 처리속도가 좀 더 빠르다.
   */
  ReactDOMServer.renderToStaticMarkup(jsx);

  /** END
   * redux-saga의 END 액션을 발생되면,
   * 액션 모니터링 작업이 모두 종료
   * 모니터링되기 전에 시작된 사가 함수들이 있다면 (getUserSaga) 해당 함수들이 완료되고 나서 Promise가 끝나게 된다.
   * 이 Promise가 끝나는 시점에 리덕스 스토어에는 우리가 원하는 데이터가 채워진다.
   * 그 이후에 다시 렌더링하면 우리가 원하는 결과물이 나타난다.
   */
  store.dispatch(END); // redux-saga 의 END 액션을 발생시키면 액션을 모니터링하는 saga 들이 모두 종료된다.

  try {
    // 기존에 진행중이던 saga 들이 모두 끝날때까지 기다린다.
    await sagaPromise;
    // 모든 프로미스를 기다린다.
    await Promise.all(preloadContext.promises);
  } catch (e) {
    return res.status(500);
  }

  preloadContext.done = true;

  const root = ReactDOMServer.renderToString(jsx); // 렌더링

  // JSON 을 문자열로 변환하고 악성스크립트가 실행되는것을 방지하기 위해서 < 를 치환처리
  // https://redux.js.org/recipes/server-rendering#security-considerations
  const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
  const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`; // 리덕스 초기 상태를 스크립트로 주입합니다.

  res.send(createPage(root, stateScript)); // 클라이언트에게 결과물을 응답한다.
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
