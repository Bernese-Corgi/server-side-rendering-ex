# 서버 사이드 렌더링

- [서버 사이드 렌더링](#서버-사이드-렌더링)
  - [서버 사이드 렌더링](#서버-사이드-렌더링-1)
    - [서버 사이드 렌더링의 장점](#서버-사이드-렌더링의-장점)
    - [서버 사이드 렌더링의 단점](#서버-사이드-렌더링의-단점)
    - [서버 사이드 렌더링과 코드 스플리팅 충돌](#서버-사이드-렌더링과-코드-스플리팅-충돌)
  - [서버 사이드 렌더링 구현](#서버-사이드-렌더링-구현)
    - [eject](#eject)
    - [서버 사이드 렌더링용 엔트리](#서버-사이드-렌더링용-엔트리)
    - [서버 사이드 렌더링 전용 웹팩 환경 설정](#서버-사이드-렌더링-전용-웹팩-환경-설정)
      - [서버 전용 환경 설정](#서버-전용-환경-설정)
      - [웹팩 환경 설정 파일](#웹팩-환경-설정-파일)
      - [로더 설정](#로더-설정)
      - [코드에서 node_modules 내부의 라이브러리를 불러오기 위한 설정](#코드에서-node_modules-내부의-라이브러리를-불러오기-위한-설정)
      - [환경변수를 주입](#환경변수를-주입)
    - [빌드 스크립트 작성하기](#빌드-스크립트-작성하기)
    - [서버 코드 작성하기](#서버-코드-작성하기)
      - [웹 프레임워크 설치](#웹-프레임워크-설치)
      - [서버 코드 작성하기](#서버-코드-작성하기-1)
    - [정적 파일 제공](#정적-파일-제공)
      - [static 미들웨어 적용](#static-미들웨어-적용)
      - [JS와 CSS 파일을 불러오도록 html 코드 삽입](#js와-css-파일을-불러오도록-html-코드-삽입)
  - [데이터 로딩](#데이터-로딩)
    - [redux-thunk](#redux-thunk)
      - [리덕스 모듈 작성하기](#리덕스-모듈-작성하기)
    - [Users, UsersContainer 컴포넌트](#users-userscontainer-컴포넌트)
    - [PreloadContext 만들기](#preloadcontext-만들기)
      - [PreloadContext](#preloadcontext)
      - [UsersContainer에 적용](#userscontainer에-적용)
    - [서버에서 리덕스 설정 및 PreloadContext 사용하기](#서버에서-리덕스-설정-및-preloadcontext-사용하기)
      - [서버에서 리덕스 설정](#서버에서-리덕스-설정)
      - [PreloadContext 사용하기](#preloadcontext-사용하기)

## 서버 사이드 렌더링

**클라이언트 사이드 렌더링**

- UI 렌더링을 브라우저에서 모두 처리하는 것
- 자바스크립트를 실행해야 우리가 만든 화면이 사용자에게 보인다.

**서버 사이드 렌더링**

- UI를 서버에서 렌더링하는 것
- 사용자가 웹 서비스에 방문했을 때 서버 쪽에서 초기 렌더링을 대신한다.
- 사용자가 html을 전달받을 때 그 내부에 렌더링된 결괌루이 보인다.

### 서버 사이드 렌더링의 장점

**1. 데이터 크롤링에 유리하다**

- 검색엔진<span style="color: gray">(구글, 네이버, 다음 등)</span>이 우리가 만든 웹 애플리케이션의 페이지를 원활하게 수집할 수 있다.
- 리액트로 만든 SPA : 자바스크립트가 실행되지 않는 환경<span style="color: gray">(검색 엔진 크롤러 봇)</span>에서는 페이지가 제대로 나타나지 않는다.
- 서버에서 렌더링하면 검색 엔진이 페이지의 내용을 제대로 수집할 수 있다.
- 구글 검색 엔진의 경우, 검색 엔진이 자바스크립트를 실행하는 기능이 있어 페이지를 제대로 크롤링해 갈 때도 있지만, 모든 페이지에 대해 자바스크립트를 실행하지는 않는다.

**2. 초기 렌더링 성능 개선**

- 서버 사이드 렌더링을 구현하지 않은 웹페이지의 경우, 자바스크립트가 로딩되고 실행될 때까지 + API 요청때 까지 사용자가 빈 화면을 보고 있을 수 있다.
- 서버 사이드 렌더링을 구현하면, 자바스크립트 파일 다운로드가 완료되지 않은 시점에서도 html 상에서 사용자가 볼 수 있는 컨텐츠가 있다.
- 대기 시간 최소화, 사용자 경험 향상

### 서버 사이드 렌더링의 단점

**1. 서버 리소스가 사용된다**

- 브라우저가 해야할 일을 서버가 대신 처리하는 것이므로 서버 리소스가 사용된다.
- 갑자기 수많은 사용자가 동시에 웹 페이지에 접속하면 서버에 과부하가 발생할 수 있다.
- 사용자가 많은 서비스라면 캐싱과 로드 밸런싱을 통해 성능을 최적화하는 작업이 필요하다.

**2. 고려할 사항이 많아져서 개발이 어려워질 수 있다.**

- 프로젝트 구조가 더 복잡해지고,
- 데이터 미리 불러오기,
- 코드 스플리팅과의 호환 등 고려해야할 사항이 많다.

### 서버 사이드 렌더링과 코드 스플리팅 충돌

서버 사이드 렌더링과 코드 스플리팅을 별도의 호환 작업 없이 적용하면, 다음과 같은 흐름으로 작동하면서 페이지에 깜박임이 발생한다.

➊ 서버 사이드 렌더링된 결과물이 브라우저에 나타남

➋ 자바스크립트 파일 로딩 시작

➌ 자바스크립트가 실행되면서 아직 불러오지 않은 컴포넌트를 null로 렌더링함

➍ 페이지에서 코드 스플리팅된 컴포넌트들이 사라짐

➎ 코드 스플리팅된 컴포넌트들이 로딩된 이후 제대로 나타남

이러한 이슈를 해결하려면 라우트 경로마다 코드 스플리팅된 파일 중에서 필요한 모든 파일을 브라우저에서 렌더링하기 전에 미리 불러와야 한다.

**해결 방법**

Loadable Components 라이브러리에서 제공하는 기능을 사용해, 서버 사이드 렌더링 후 필요한 파일의 경로를 추출하여 렌더링 결과에 스크립트/스타일 태그를 삽입해 준다.

## 서버 사이드 렌더링 구현

### eject

```bash
$ npm run eject
```

### 서버 사이드 렌더링용 엔트리

**엔트리(entry)** : 웹팩에서 프로젝트를 불러올 때 가장 먼저 불러오는 파일

현재 작성 중인 리액트 프로젝트에서는 `src/index.js`를 엔트리 파일로 사용한다.

이 파일부터 시작하여 내부에 필요한 다른 컴포넌트와 모듈을 불러오고 있지요.

서버 사이드 렌더링을 할 때는 서버를 위한 엔트리 파일을 따로 생성해야 한다.(`src/index.server.js`)

<span style="color: #a3a8a5">▾ src/index.server.js</span>

```jsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const html = ReactDOMServer.renderToString(
  <div>Hello server Side Rendering!</div>
);

console.log(html);
```

**`renderToString` 함수** : JSX를 넣어서 호출하면 렌더링 결과를 문자열로 반환한다.

### 서버 사이드 렌더링 전용 웹팩 환경 설정

#### 서버 전용 환경 설정

작성한 엔트리 파일을 웹팩으로 불러와서 빌드하기 위한 서버 전용 환경을 설정해야 한다.

<span style="color: #a3a8a5">▾ config/path.js</span>

```js
module.exports = {
  // ...
  ssrIndexJS: resolveApp('src/index.server.js'), // 서버 사이드 렌더링 엔트리 경로
  ssrBuild: resolveApp('dist'), // 웹팩 처리 후 저장 경로
};
```

#### 웹팩 환경 설정 파일

웹팩 기본 설정을 작성한다. 빌드할 때 어떤 파일에서 시작해 파일들을 불러올지, 어디에 결과물을 저장할지 결정

<span style="color: #a3a8a5">▾ config/webpack.config.server.js</span>

```js
const paths = require('./paths');

module.exports = {
  mode: 'production', // 프로덕션 모드로 설정하여 최적화 옵션들을 활성화
  entry: paths.ssrIndexJS, // 엔트리 경로
  target: 'node', // node 환경에서 실행될 것임을 명시
  output: {
    path: paths.ssrBuild, // 빌드 경로
    filename: 'server.js', // 파일 이름
    chunkFilename: 'js/[name].chunk.js', // 청크 파일 이름
    publicPath: paths.servedPath, // 정적 파일이 제공될 경로
  },
};
```

#### 로더 설정

웹팩의 로더는 파일을 불러올 때 확장자에 맞게 필요한 처리를 한다.

- 자바스크립트 : babel을 사용해 트랜스 파일링
- CSS : 모든 CSS 코드를 결합
- 이미지 파일 : 파일을 다른 경로에 따로 저장하고, 그 파일에 대한 경로를 자바스크립트에서 참조할 수 있게 한다.

서버 사이드 렌더링을 할 때는 CSS나 이미지 파일은 크게 중요하지 않지만, 완전히 무시할 수는 없다.

가끔 자바스크립트 내부에서 파일에 대한 경로가 필요하거나 CSS Module처럼 로컬 className을 참조하는 경우도 있기 때문이다.

해당 파일을 로더에서 별도로 설정해 처리하지만, 따로 결과물에 포함되지 않도록 구현할 수 있다.

<details>
<summary>로더 설정 코드 (config/webpack.config.server.js)</summary>
<div markdown="1">

<span style="color: #a3a8a5">▾ config/webpack.config.server.js</span>

```js
const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const cssRegex = /.css$/;
const cssModuleRegex = /.module.css$/;
const sassRegex = /.(scss|sass)$/;
const sassModuleRegex = /.module.(scss|sass)$/;

module.exports = {
  // ...
  module: {
    rules: [
      {
        oneOf: [
          // 자바스크립트를 위한 처리
          // 기존 webpack.config.js를 참고하여 작성
          {
            test: /.(js|mjs|jsx|ts|tsx)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent: '@svgr/webpack?-svgo![path]',
                      },
                    },
                  },
                ],
              ],
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
            },
          },
          // CSS를 위한 처리
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            //  exportOnlyLocals: true 옵션을 설정해야 실제 CSS 파일을 생성하지 않습니다.
            loader: require.resolve('css-loader'),
            options: {
              exportOnlyLocals: true,
            },
          },
          // CSS Module을 위한 처리
          {
            test: cssModuleRegex,
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              exportOnlyLocals: true,
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          // Sass를 위한 처리
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  exportOnlyLocals: true,
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          // Sass + CSS Module을 위한 처리
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              {
                loader: require.resolve('css-loader'),
                options: {
                  modules: true,
                  exportOnlyLocals: true,
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              },
              require.resolve('sass-loader'),
            ],
          },
          // url-loader를 위한 설정
          {
            test: [/.bmp$/, /.gif$/, /.jpe?g$/, /.png$/],
            loader: require.resolve('url-loader'),
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              limit: 10000, // 원래는 9.76KB가 넘어가면 파일로 저장하는데
              // emitFile 값이 false일 때는 경로만 준비하고 파일은 저장하지 않습니다.
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // 위에서 설정된 확장자를 제외한 파일들은
          // file-loader를 사용합니다.
          {
            loader: require.resolve('file-loader'),
            exclude: [/.(js|mjs|jsx|ts|tsx)$/, /.html$/, /.json$/],
            options: {
              emitFile: false, // 파일을 따로 저장하지 않는 옵션
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
};
```

</div>
</details>

<br />

#### 코드에서 node_modules 내부의 라이브러리를 불러오기 위한 설정

<span style="color: #a3a8a5">▾ config/webpack.config.server.js</span>

```js
module.exports = {
  // ...
  resolve: {
    modules: ['node_modules'],
  },
};
```

위와 같이 설정하면, 라이브러리를 `import` 구문으로 불러오면 `node_modules`에서 찾아 사용한다.

라이브러리를 불러오면 빌드할 때 결과물 파일 안에 해당 라이브러리 관련 코드가 함께 번들링된다.

**브라우저에서** : 결과물 파일에 리액트 라이브러리와 애플리케이션에 관한 코드가 공존해야 한다.

**서버에서** : 결과물 파일 안에 리액트 라이브러리가 들어 있지 않아도 된다. `node_modules`를 통해 바로 불러와서 사용할 수 있기 때문.

따라서 서버를 위해 번들링할 때는 `node_modules`에서 불러오는 것을 제외하고 번들링하는 것이 좋다.
→ `webpack-node-externals`라는 라이브러리를 사용해야 한다.

```bash
$ npm i webpack-node-externals
```

`webpack-node-externals` 라이브러리를 webpack.config.server.js의 상단에 불러와서 설정에 적용한다.

<span style="color: #a3a8a5">▾ config/webpack.config.server.js</span>

```js
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  // ...
  externals: [nodeExternals()],
};
```

#### 환경변수를 주입

<span style="color: #a3a8a5">▾ config/webpack.config.server.js</span>

```js
const getClientEnvironment = require('./env');

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

module.exports = {
  // ...
  plugins: [
    new webpack.DefinePlugin(env.stringified), // 환경변수를 주입해 줍니다.
  ],
};
```

환경변수를 주입하면, 프로젝트 내에서 `process.env.NODE_ENV` 값을 참조하여 현재 개발 환경인지 아닌지를 알 수 있다.

### 빌드 스크립트 작성하기

웹팩 환경 설정을 사용하여 웹팩으로 프로젝트를 빌드하는 스크립트를 작성.

`scripts/build.js` 스크립트 : 클라이언트에서 사용할 빌드 파일을 만드는 작업을 한다.

`scripts/build.server.js` 스크립트 : 서버에서 사용할 빌드 파일을 만드는 작업을 한다.

<span style="color: #a3a8a5">▾ scripts/build.server.js</span>

```js
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.server');
const paths = require('../config/paths');

function build() {
  console.log('Creating server build…');
  fs.emptyDirSync(paths.ssrBuild);
  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stats.toString());
    });
  });
}

build();
```

**서버 빌드하기**

```bash
$ node scripts/build.server.js
```

**서버 실행하기**

```bash
$ node dist/server.js
```

<!--

매번 빌드하고 실행할 때마다 파일 경로를 입력하는 것이 번거로울 수 있으니, package.json에서 스크립트를 생성하여 더 편하게 명령어를 입력할 수 있도록 하겠습니다.

<span style="color: #a3a8a5">▾ package.json - scripts 부분</span>

```json
"scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js",
    "start:server": "node dist/server.js",
    "build:server": "node scripts/build.server.js"
  },
```

이렇게 스크립트를 만들면 다음 명령어로 서버를 빌드하고 시작할 수 있습니다.

```bash
$ yarn build:server
$ yarn start:server
```

 -->

### 서버 코드 작성하기

서버 사이드 렌더링을 처리할 서버를 작성.

#### 웹 프레임워크 설치

Express

- 웹 서버를 만드는 Node.js 웹 프레임워크
- 사용률이 가장 높은 프레임워크
- 추후 정적 파일들을 호스팅할 때도 쉽게 구현할 수 있다.

Express 외에도 Koa, Hapi 또는 connect 라이브러리를 사용할 수 있다.

```bash
$ npm install express
```

#### 서버 코드 작성하기

리액트 서버 사이드 렌더링을 통해 만들어진 결과를 보여 주도록 처리하는 서버 코드 작성

<span style="color: #a3a8a5">▾ src/index.server.js</span>

```jsx
// ...
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom';

const app = express();

// 서버 사이드 렌더링을 처리할 핸들러 함수입니다.
const serverRender = (req, res, next) => {
  // 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 해 줍니다.

  const context = {};

  // 초기에 렌더링할 jsx
  const jsx = (
    <StaticRouter
      // location에 넣는 값에 따라 라우팅한다.
      location={req.url} // req 객체는 요청에 대한 정보를 가지고 있다.
      // context 값을 사용해 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정할 수 있다.
      context={context}>
      <App />
    </StaticRouter>
  );

  const root = ReactDOMServer.renderToString(jsx); // 렌더링을 하고
  res.send(root); // 클라이언트에게 결과물을 응답합니다.
};

app.use(serverRender);

// 5000 포트로 서버를 가동합니다.
app.listen(5000, () => {
  console.log('Running on http://localhost:5000');
});
```

<span style="background-color: #f0cabd; font-weight: 700">➊ express( ) 함수</span>

express 모듈에서 내보낸 최상위 함수

```js
const express = require('express');
const app = express();
```

<span style="background-color: #f0cabd; font-weight: 700">➋ app.use(...)</span>

지정된 경로에 지정된 미들웨어 함수를 마운트한다.
미들웨어 함수는 요청된 경로의 기준이 경로와 일치할 때 실행된다.

```js
app.use([path,] callback [, callback...])
```

**path**

- 미들웨어 기능이 호출되는 경로, 기본적으로 `"/"`
- 경로는 `"/"`로 즉시 경로를 따르는 모든 경로와 일치한다.
- 경로는 기본적으로 `"/"`이므로 경로 없이 마운트된 미들웨어는 앱에 대한 모든 요청에 ​​대해 실행된다.

**callback**

```jsx
app.use(function (req, res, next) {
  // ...
});
```

- `app.use()`에 전달하는 미들웨어 콜백 함수
- 위 코드에서는 `serverRender` 함수
- 서버 사이드 렌더링을 처리할 핸들러 함수
- 404가 떠야 하는 상황에 404를 띄우지 않고 서버 사이드 렌더링을 한다.

매개변수 ▾

1. `req` <span style="color: gray">(객체)</span>

   - HTTP 요청에 대한 정보를 가지고 있다.
   - 요청 쿼리 문자열, 매개변수, 본문, HTTP 헤더 등에 대한 속성을 가지고 있다.
   - `req.url`을 `StaticRouter` 컴포넌트의 `location` 값에 넣어준다.
   - `req.url`은 기본 Express 속성이 아니며 Node의 http 모듈에서 상속됩니다.

2. `res` <span style="color: gray">(객체)</span> : Express 앱이 HTTP 요청을 받을 때 보내는 HTTP 응답을 나타낸다.

<span style="background-color: #f0cabd; font-weight: 700">➌ StaticRouter 컴포넌트</span>

- 리액트 라우터 안에 들어있는 컴포넌트
- 주로 서버 사이드 렌더링 용도로 사용되는 라우터

**props**

① `location` : location 값에 따라 라우팅한다.

② `context`

- 렌더링하는 동안 컴포넌트는 `context` 객체에 속성을 추가하여 렌더링에 대한 정보를 저장할 수 있다.
- `<Route>`가 일치하면 `context` 객체를 `staticContext` props로 렌더링하는 컴포넌트에 전달한다.
- 렌더링 후 이러한 속성을 사용하여 서버의 응답을 구성할 수 있습니다.
- `context` 값을 사용해 나중에 렌더링한 컴포넌트에 따라 HTTP 상태 코드를 설정할 수 있다.

<span style="background-color: #f0cabd; font-weight: 700">➍ 초기 렌더링</span>

**ReactDOMServer** : ReactDOMServer 객체를 통해 컴포넌트를 정적 마크업으로 렌더링할 수 있다.

**renderToString**

```js
const root = ReactDOMServer.renderToString(jsx);
```

- React 엘리먼트의 초기 HTML을 렌더링한다.
- React는 HTML 문자열을 반환합니다.
- 초기 요청 시에 서버에서 HTML을 생성하여 마크업을 보내거나,
- 검색 엔진 최적화를 위해 검색 엔진이 페이지를 크롤링할 수 있도록 하는데 사용할 수 있다.

<span style="background-color: #f0cabd; font-weight: 700">➎ res.send ( [ body ] )</span>

HTTP 응답을 보낸다.

body 매개변수에 `renderToString`으로 생성한 정적 마크업을 넣는다.

```js
res.send(root);
```

<span style="background-color: #f0cabd; font-weight: 700">➏ app.listen( ... )</span>

```js
app.listen([port[, host[, backlog]]][, callback])
```

지정된 호스트 및 포트에서 연결을 바인딩하고 수신 대기한다.

이 메소드는 Node의 `http.Server.listen()`과 동일

포트가 생략되거나 0이면 운영 체제는 사용하지 않는 임의의 포트를 할당하므로 자동화된 작업(테스트 등)과 같은 경우에 유용하다.

`express()`에 의해 반환된 `app`은 실제로 요청을 처리하기 위한 콜백으로 Node의 HTTP 서버에 전달되도록 설계된 JavaScript 함수이다.

이렇게 하면 `app`이 다음에서 상속하지 않으므로(단순히 콜백임) 동일한 코드 기반으로 앱의 HTTP 및 HTTPS 버전을 모두 쉽게 제공할 수 있습니다.

### 정적 파일 제공

Express에 내장되어 있는 static 미들웨어를 사용하여 서버를 통해 build에 있는 JS, CSS 정적 파일들에 접근한다.

#### static 미들웨어 적용

<span style="color: #a3a8a5">▾ index.server.js</span>

```jsx
import path from 'path';

const app = express();

// ...

const serve = express.static(path.resolve('./build'), {
  index: false, // "/” 경로에서 index.html을 보여 주지 않도록 설정
});

app.use(serve); // 순서가 중요합니다. serverRender 전에 위치해야 합니다.
app.use(serverRender);

// ...
```

**static 미들웨어**

```js
express.static(root, [options]);
```

Express에 내장된 미들웨어 기능. 정적 파일을 제공한다.

`root`

- 정적 자산을 제공할 루트 디렉토리 지정
- `req.url`을 제공된 루트 디렉토리와 결합하여 제공할 파일을 결정
- 파일을 찾을 수 없으면 404 응답을 보내는 대신 `next()`를 호출해 다음 미들웨어로 이동해 스택 및 폴백을 허용한다.

#### JS와 CSS 파일을 불러오도록 html 코드 삽입

불러와야 하는 파일 이름은 매번 빌드할 때마다 바뀌기 때문에 빌드하고 나서 만들어지는 `build/asset-manifest.json` 파일을 참고하여 불러오도록 작성

**빌드 명령어 입력**

```bash
$ npm run build
```

<span style="color: #a3a8a5">▾ build/asset-manifest.json</span>

```json
{
  "files": {
    "main.css": "/static/css/main.b5fbe955.chunk.css",
    "main.js": "/static/js/main.4706fa80.chunk.js",
    "runtime-main.js": "/static/js/runtime-main.c5541365.js",
    "static/js/2.7980f885.chunk.js": "/static/js/2.7980f885.chunk.js"
    // ...
  }
}
```

위의 파일들을 html 내부에 삽입해야한다.

서버 코드를 다음과 같이 수정

<span style="color: #a3a8a5">▾ index.server.js</span>

```jsx
// ...
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

// ...
// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = (req, res, next) => {
  // ...
  const root = ReactDOMServer.renderToString(jsx); // 렌더링
  res.send(createPage(root)); // 클라이언트에게 결과물을 응답한다.
};
// ...
```

<span style="background: #f0cabd; font-weight: 700">asset-manifest.json에서 파일 경로들을 조회</span>

**① fs.readFileSync**

```js
fs.readFileSync(path[, options])
```

경로의 내용을 반환

인코딩 옵션(`'utf-8'`)이 지정되면 이 함수는 문자열을 반환

**② JSON.parse**

문자열로 반환된 값을 json 형식으로 변환

```js
const manifest = JSON.parse(
  fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf-8')
);
```

<span style="background: #f0cabd; font-weight: 700">chunk 파일 처리</span>

<span style="color: #a3a8a5">▾ build/asset-manifest.json</span>

```json
{
  "files": {
    "static/js/2.7980f885.chunk.js": "/static/js/2.7980f885.chunk.js"
    // ...
  }
}
```

chunk.js로 끝나는 키를 찾아서 스크립트 태그로 변환

```js
const chunks = Object.keys(manifest.files)
  .filter(key => /chunk\.js$/.exec(key)) // chunk.js로 끝나는 키를 찾아서
  .map(key => `<script src="${manifest.files[key]}"></script>`) // 스크립트 태그로 변환하고
  .join(''); // 합침
```

<span style="background: #f0cabd; font-weight: 700">정적 페이지 코드 작성</span>

asset-manifest.json에서 조회하고 있는 파일들을 페이지 코드에 각각 넣어서 jsx를 반환하는 함수를 작성한다.

```jsx
function createPage(root, tags) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <!-- ... -->
      <link href="${manifest.files['main.css']}" rel="stylesheet" />
    </head>
    <body>
      <div id="root">${root}</div>
      <script src="${manifest.files['runtime-main.js']}"></script>
      ${chunks}
      <script src="${manifest.files['main.js']}"></script>
    </body>
  </html>
      `;
}
```

이렇게 작성하면 CSS와 JS를 정적 파일로 제공할 수 있다.

서버 사이드 렌더링을 구현하면 첫 번째 렌더링은 서버를 통해서 하고, 그 이후에는 브라우저에서 처리한다.

다른 링크를 클릭해 다른 페이지로 이동할 때 네트워크 요청이 추가로 발생하지 않아야 한다.

## 데이터 로딩

**서버 사이드 렌더링 구현 시**

**① 데이터 로딩 구현 문제**

- 서버 사이드 렌더링을 구현할 때는 데이터 로딩을 해결하기 까다롭다.
- 데이터 로딩을 한다 = API 요청을 의미한다.
- 페이지에서 필요로 하는 데이터가 있다면 API를 요청해서 응답을 받아와야 한다.
- **브라우저 환경** : API를 요청하고 응답을 받아와서 리액트 state 혹은 리덕스 스토어에 넣으면 자동으로 리렌더링되므로 문제가 크게 없다.
- **서버** : 문자열 형태로 렌더링하는 것이므로 state나 리덕스 스토어의 상태가 바뀐다고 자동으로 리렌더링되지 않는다. 그래서 개발자가 `renderToString` 함수를 한 번 더 호출해야한다.

**② 라이프사이클 API 사용에 문제**

- 서버에서는 componentDidMount 같은 라이프사이클 API도 사용할 수 없다.

**데이터 로딩 문제 해결 방법**

- 서버 사이드 렌더링 시 데이터 로딩을 해결하는 방법 또한 다양하다.
- 이 프로젝트에서는 redux-thunk 또는 redux-saga 미들웨어를 사용하여 API를 호출하는 환경에서 서버 사이드 렌더링하는 방법을 사용했다.

### redux-thunk

#### 리덕스 모듈 작성하기

**1. 필요한 라이브러리 설치**

```bash
$ npm install redux react-redux redux-thunk axios
```

**2. 리덕스 모듈 작성**

<details>
<summary>리덕스 모듈 전체 코드</summary>
<div markdown="1">

<span style="color: #a3a8a5">▾ src/modules/users.js</span>

```jsx
import axios from 'axios';

/* 액션 타입 --------------------------------- */
const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
const GET_USERS_FAILURE = 'users/GET_USERS_FAILURE';

/* 액션 생성 함수 -------------------------------- */
const getUsersPending = () => ({ type: GET_USERS_PENDING });
const getUsersSuccess = payload => ({ type: GET_USERS_SUCCESS, payload });
const getUsersFailure = payload => ({
  type: GET_USERS_FAILURE,
  error: true,
  payload,
});

/* thunk 함수 -------------------------------- */
export const getUsers = () => async dispatch => {
  try {
    dispatch(getUsersPending());
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    dispatch(getUsersSuccess(response));
  } catch (e) {
    dispatch(getUsersFailure(e));
    throw e;
  }
};

/* 초기 상태 --------------------------------- */
const initialState = {
  users: null,
  loading: {
    users: false,
    user: false,
  },
  error: {
    users: null,
    user: null,
  },
};

/* 리듀서 ---------------------------------- */
// 이 모듈에서 관리하는 API는 한 개 이상이므로 loadingUsers, loadingUser 와 같이 각 값에 하나하나 이름을 지어 주는 대신이 loading이라는 객체에 넣어준 것이다.
function users(state = initialState, action) {
  switch (action.type) {
    case GET_USERS_PENDING:
      return {
        ...state,
        loading: { ...state.loading, users: true },
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        users: action.payload.data,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        error: { ...state.error, users: action.payload },
      };
    default:
      return state;
  }
}

export default users;
```

</div>
</details>

<br />

**액션 타입**

<span style="color: #a3a8a5">▾ src/modules/users.js</span>

```js
/* 액션 타입 --------------------------------- */
const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
const GET_USERS_FAILURE = 'users/GET_USERS_FAILURE';
```

**액션 생성 함수**

<span style="color: #a3a8a5">▾ src/modules/users.js</span>

```js
/* 액션 생성 함수 -------------------------------- */
const getUsersPending = () => ({ type: GET_USERS_PENDING });
const getUsersSuccess = payload => ({ type: GET_USERS_SUCCESS, payload });
const getUsersFailure = payload => ({
  type: GET_USERS_FAILURE,
  error: true,
  payload,
});
```

`'https://jsonplaceholder.typicode.com/users'` : 이 API는 사용자들에 대한 정보를 응답한다.

**thunk 함수**

<span style="color: #a3a8a5">▾ src/modules/users.js</span>

```js
/* thunk 함수 -------------------------------- */
export const getUsers = () => async dispatch => {
  try {
    dispatch(getUsersPending());
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/users'
    );
    dispatch(getUsersSuccess(response));
  } catch (e) {
    dispatch(getUsersFailure(e));
    throw e;
  }
};
```

**초기 상태**

<span style="color: #a3a8a5">▾ src/modules/users.js</span>

```js
/* 초기 상태 --------------------------------- */
const initialState = {
  users: null,
  loading: {
    users: false,
    user: false,
  },
  error: {
    users: null,
    user: null,
  },
};
```

모듈의 상태에는 `loading`과 `error` 객체가 들어 있다.

모듈에서 관리하는 API가 한 개 이상일 예정이므로, 이 객체에 모두 넣었다.

**리듀서**

<span style="color: #a3a8a5">▾ src/modules/users.js</span>

```js
/* 리듀서 ---------------------------------- */
function users(state = initialState, action) {
  switch (action.type) {
    case GET_USERS_PENDING:
      return {
        ...state,
        loading: { ...state.loading, users: true },
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        users: action.payload.data,
      };
    case GET_USERS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, users: false },
        error: { ...state.error, users: action.payload },
      };
    default:
      return state;
  }
}

export default users;
```

**3. 루트 리듀서 생성**

<span style="color: #a3a8a5">▾ src/modules/index.js</span>

```jsx
import { combineReducers } from 'redux';
import users from './users';

const rootReducer = combineReducers({ users });
export default rootReducer;
```

**4. 프로젝트에 리덕스 적용**

<span style="color: #a3a8a5">▾ src/index.js</span>

```jsx
// ...
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './modules';
import { Provider } from 'react-redux';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
```

### Users, UsersContainer 컴포넌트

사용자에 대한 정보를 보여 줄 컴포넌트

**1. 컴포넌트**

<span style="color: #a3a8a5">▾ src/components/Users.js</span>

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Users = ({ users }) => {
  // users가 유효하지 않으면 아무 것도 보여주지 않음
  if (!users) return null;

  return (
    <div>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/users/${user.id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
```

**2. 컨테이너**

<span style="color: #a3a8a5">▾ src/containers/UsersContainer.js</span>

```jsx
import React, { useEffect } from 'react';
import Users from '../components/Users';
import { connect } from 'react-redux';
import { getUsers } from '../modules/users';

const UsersContainer = ({ users, getUsers }) => {
  // 컴포넌트가 마운트되고 나서 호출
  useEffect(() => {
    // users가 이미 유효하다면 요청하지 않음
    if (users) return;
    getUsers();
  }, [getUsers, users]);

  return <Users users={users} />;
};

export default connect(
  state => ({
    users: state.users.users,
  }),
  {
    getUsers,
  }
)(UsersContainer);
```

서버 사이드 렌더링을 할 때는 이미 있는 정보를 재요청하지 않게 처리하는 작업이 중요하다.

이 작업을 하지 않으면 서버 사이드 렌더링 후 브라우저에서 페이지를 확인할 때 이미 데이터를 가지고 있음에도 불구하고 불필요한 API를 호출하게 된다. (트래픽도 낭비, 사용자 경험 저하)

**3. 페이지**

<span style="color: #a3a8a5">▾ pages/UsersPage.js</span>

```jsx
import React from 'react';
import { UsersContainer } from '../containers';

const UsersPage = () => {
  return <UsersContainer />;
};

export default UsersPage;
```

**4. App에서 라우팅**

<span style="color: #a3a8a5">▾ App.js</span>

```jsx
import { Route } from 'react-router';
import { BluePage, RedPage, UsersPage } from './pages';
import { Menu } from './components';

function App() {
  return (
    <div>
      <Menu />
      <hr />
      {/* ... */}
      <Route path="/users" component={UsersPage} />
    </div>
  );
}

export default App;
```

**5. Menu 컴포넌트**

브라우저에서 더욱 쉽게 /users 경로로 이동할 수 있도록 Menu 컴포넌트도 수정

<span style="color: #a3a8a5">▾ src/components/Menu.js</span>

```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <ul>
      {/* ... */}
      <li>
        <Link to="/users">Users</Link>
      </li>
    </ul>
  );
};

export default Menu;
```

아직 데이터 로딩에 대한 서버 사이드 렌더링이 모두 구현되지는 않았지만,리액트 개발 서버<span style="color: gray">(포트주소 3000)</span>에서 작동하는지 확인할 수 있다.

### PreloadContext 만들기

서버 사이드 렌더링을 할 때는 라이프사이클 API를 사용할 수 없다. [🔗](#데이터-로딩) 그러므로 useEffect에서 설정한 작업이 호출되지 않는다.

그러므로 렌더링하기 전에 API를 요청한 뒤 스토어에 데이터를 담아야 한다.

서버 환경에서 이런 작업을 하려면 클래스형 컴포넌트가 가지고 있는 `constructor` 메서드를 사용하거나, `render` 함수에서 처리해야 하고, 요청이 끝날 때까지 대기했다가 다시 렌더링해야 한다.

이 프로젝트에서는 이 작업을 PreloadContext를 만들고, 이를 사용하는 Preloader 컴포넌트를 만들어 처리한다.

#### PreloadContext

<span style="color: #a3a8a5">▾ src/lib/PreloadContext.js</span>

```jsx
import { createContext, useContext } from 'react';

/* 클라이언트 환경: null
   서버 환경: { done: false, promises: [] } */
const PreloadContext = createContext(null);
export default PreloadContext;

export const Preloader = ({ resolve } /* reslove는 함수 타입 */) => {
  const preloadContext = useContext(PreloadContext);

  // context 값이 유효하지 않다면 아무것도 하지 않음
  if (!preloadContext) return null;

  // 이미 작업이 끝났다면 아무것도 하지 않음
  if (preloadContext.done) return null;

  /** promises 배열에 프로미스 등록
    : resolve 함수가 프로미스를 반환하지 않더라도, 프로미스를 취급하기 위해 Promise.resolve 함수 사용 */
  preloadContext.promises.push(Promise.resolve(resolve()));

  return null;
};
```

**createContext**

```js
const PreloadContext = createContext(null);
```

Context 객체를 만든다.

Context 객체를 구독하고 있는 컴포넌트를 렌더링할 때 React는 트리 상위에서 가장 가까이 있는 짝이 맞는 Provider로부터 현재값을 읽는다.

인수 `defaultValue` : 기본값. 트리 안에서 적절한 Provider를 찾지 못했을 때만 쓰이는 값.

**Preloader 컴포넌트**

`resolve` 함수를 props로 받아와서, 컴포넌트가 렌더링될 때 서버 환경에서만 `resolve` 함수를 호출

#### UsersContainer에 적용

<span style="color: #a3a8a5">▾ src/containers/UsersContainer.js</span>

```jsx
// ...
import { Preloader } from '../lib/PreloadContext';
import { getUsers } from '../modules/users';

const UsersContainer = ({ users, getUsers }) => {
  // ...
  return (
    <>
      <Users users={users} />
      <Preloader resolve={getUsers} />
    </>
  );
};
```

### 서버에서 리덕스 설정 및 PreloadContext 사용하기

#### 서버에서 리덕스 설정

브라우저와 큰 차이가 없다.

주의할 점은 서버가 실행될 때 스토어를 한 번만 만드는 것이 아니라, 요청이 들어올 때마다 새로운 스토어를 만든다.

<span style="color: #a3a8a5">▾ src/index.server.js</span>

```jsx
// ...
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './modules';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

// ...

const serverRender = (req, res, next) => {
  // ...

  // 서버에서 리덕스 설정
  const store = createStore(rootReducer, applyMiddleware(thunk));

  const jsx = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );
  // ...
};

// ...
```

#### PreloadContext 사용하기

PreloadContext를 사용하여 프로미스들을 수집하고 기다렸다가 다시 렌더링하는 작업 작성

<span style="color: #a3a8a5">▾ src/index.server.js</span>

```jsx
// ...
import PreloadContext from './lib/PreloadContext';

// 서버 사이드 렌더링을 처리할 핸들러 함수
const serverRender = async (req, res, next) =>
  //...
  // PreloadContext를 사용해 프로미스들을 수집하고 기다렸다가 다시 렌더링
  const preloadContext = {
    done: false,
    promises: [],
  };

  const jsx = (
    <PreloadContext.Provider store={store} value={preloadContext}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </PreloadContext.Provider>
  );

  // 첫 번째 렌더링
  ReactDOMServer.renderToStaticMarkup(jsx);
  try {
    // 모든 프로미스를 기다린다.
    await Promise.all(preloadContext.promises);
  } catch (e) {
    return res.status(500);
  }

  preloadContext.done = true;
  // ...
};
// ...
```

**src/lib/PreloadContext**

1. 서버 사이드 렌더링을 하는 과정에서 처리해야 할 작업들을 실행

2. 기다려야 하는 프로미스가 있다면 프로미스를 수집

3. 모든 프로미스를 수집하면, 수집된 프로미스들이 끝날 때까지 기다렸다가 다시 렌더링

4. 데이터가 채워진 상태로 컴포넌트가 나타난다.

**PreloadContext.Provider**

context를 구독하는 컴포넌트들에게 context의 변화를 알리는 역할을 한다.

`value` : 하위에 있는 컴포넌트에게 이 값을 전달하고, context를 구독하는 모든 컴포넌트는 이 값이 바뀔때마다 다시 렌더링 된다.

**첫 번째 렌더링**

`renderToString` 대신 `renderToStaticMarkup`이라는 함수를 사용했습니다.

`renderToStaticMarkup` : 리액트를 사용하여 정적인 페이지를 만들 때 사용. 이 함수로 만든 리액트 렌더링 결과물은 클라이언트 쪽에서 HTML DOM 인터랙션을 지원하기 어렵다

여기서 사용하는 `renderToStaticMarkup`함수는 Preloader로 넣어 주었던 함수를 호출하기만 한다. 처리 속도가 `renderToString`보다 좀 더 빠르기 때문에 사용했다.
