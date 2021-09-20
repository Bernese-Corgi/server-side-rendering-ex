import React from 'react';
import ReactDOMServer from 'react-dom/server';

/**
 * renderToString 함수
 * JSX를 넣어서 호출하면 렌더링 결과를 문자열로 반환한다.
 */
const html = ReactDOMServer.renderToString(
  <div>Hello server Side Rendering!</div>
);

console.log(html);
