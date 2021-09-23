!function(e){var t={};function n(r){if(t[r])return t[r].exports;var c=t[r]={i:r,l:!1,exports:{}};return e[r].call(c.exports,c,c.exports,n),c.l=!0,c.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var c in e)n.d(r,c,function(t){return e[t]}.bind(null,c));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/",n(n.s=13)}([function(e,t){e.exports=require("react/jsx-runtime")},function(e,t){e.exports=require("react")},function(e,t){e.exports=require("react-router")},function(e,t){e.exports=require("react-router-dom")},function(e,t){e.exports=require("express")},function(e,t,n){e.exports=n(12)},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("react-dom/server")},function(e,t){e.exports=require("react-redux")},function(e,t){e.exports=require("@babel/runtime/helpers/esm/defineProperty")},function(e,t){e.exports=require("axios")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("regenerator-runtime")},function(e,t,n){"use strict";n.r(t);var r=n(1),c=n(7),i=n.n(c),o=n(4),u=n.n(o),s=n(2),a=n(0),l=function(){return Object(a.jsx)("div",{className:"Red",children:"Red"})},f=function(){return Object(a.jsx)("div",{className:"Blue",children:"Blue"})},p=n(3),d=function(){return Object(a.jsxs)("ul",{children:[Object(a.jsx)("li",{children:Object(a.jsx)(p.Link,{to:"/red",children:"Red"})}),Object(a.jsx)("li",{children:Object(a.jsx)(p.Link,{to:"/blue",children:"Blue"})}),Object(a.jsx)("li",{children:Object(a.jsx)(p.Link,{to:"/users",children:"Users"})})]})},j=function(e){var t=e.users;return t?Object(a.jsx)("div",{children:Object(a.jsx)("ul",{children:t.map((function(e){return Object(a.jsx)("li",{children:Object(a.jsx)(p.Link,{to:"/users/".concat(e.id),children:e.username})},e.id)}))})}):null},x=function(){return Object(a.jsx)(l,{})},b=function(){return Object(a.jsx)(f,{})},h=n(8);n(9);var v=n(5),m=n.n(v);function O(e,t,n,r,c,i,o){try{var u=e[i](o),s=u.value}catch(e){return void n(e)}u.done?t(s):Promise.resolve(s).then(r,c)}var y=n(10),S=n.n(y),g=function(e){return{type:"users/GET_USERS_FAILURE",error:!0,payload:e}};var R=Object(h.connect)((function(e){return{users:e.users.users}}),{getUsers:function(){return function(){var e,t=(e=m.a.mark((function e(t){var n;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t({type:"users/GET_USERS_PENDING"}),e.next=4,S.a.get("https://jsonplaceholder.typicode.com/users");case 4:n=e.sent,t({type:"users/GET_USERS_SUCCESS",payload:n}),e.next=12;break;case 8:throw e.prev=8,e.t0=e.catch(0),t(g(e.t0)),e.t0;case 12:case"end":return e.stop()}}),e,null,[[0,8]])})),function(){var t=this,n=arguments;return new Promise((function(r,c){var i=e.apply(t,n);function o(e){O(i,r,c,o,u,"next",e)}function u(e){O(i,r,c,o,u,"throw",e)}o(void 0)}))});return function(e){return t.apply(this,arguments)}}()}})((function(e){var t=e.users,n=e.getUsers;return Object(r.useEffect)((function(){t||n()}),[n,t]),Object(a.jsx)(j,{users:t})})),q=function(){return Object(a.jsx)(R,{})};var _=function(){return Object(a.jsxs)("div",{children:[Object(a.jsx)(d,{}),Object(a.jsx)("hr",{}),Object(a.jsx)(s.Route,{path:"/red",component:x}),Object(a.jsx)(s.Route,{path:"/blue",component:b}),Object(a.jsx)(s.Route,{path:"/users",component:q})]})},k=n(6),E=n.n(k),P=n(11),w=n.n(P),U=JSON.parse(w.a.readFileSync(E.a.resolve("./build/asset-manifest.json"),"utf-8")),T=Object.keys(U.files).filter((function(e){return/chunk\.js$/.exec(e)})).map((function(e){return'<script src="'.concat(U.files[e],'"><\/script>')})).join("");var L=u()(),N=u.a.static(E.a.resolve("./build"),{index:!1});L.use(N),L.use((function(e,t,n){var r=Object(a.jsx)(s.StaticRouter,{location:e.url,context:{},children:Object(a.jsx)(_,{})}),c=i.a.renderToString(r);t.send(function(e,t){return'<!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <meta charset="utf-8" />\n      <link rel="shortcut icon" href="/favicon.ico" />\n      <meta\n        name="viewport"\n        content="width=device-width,initial-scale=1,shrink-to-fit=no"\n      />\n      <meta name="theme-color" content="#000000" />\n      <title>React App</title>\n      <link href="'.concat(U.files["main.css"],'" rel="stylesheet" />\n    </head>\n    <body>\n      <noscript>You need to enable JavaScript to run this app.</noscript>\n      <div id="root">\n        ').concat(e,'\n      </div>\n      <script src="').concat(U.files["runtime-main.js"],'"><\/script>\n      ').concat(T,'\n      <script src="').concat(U.files["main.js"],'"><\/script>\n    </body>\n    </html>\n      ')}(c))})),L.listen(5e3,(function(){console.log("Running on http://localhost:5000")}))}]);