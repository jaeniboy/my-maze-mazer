if(!self.define){let e,i={};const n=(n,o)=>(n=new URL(n+".js",o).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(o,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let s={};const f=e=>n(e,c),a={module:{uri:c},exports:s,require:f};i[c]=Promise.all(o.map((e=>a[e]||f(e)))).then((e=>(r(...e),s)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"android-chrome-192x192.png",revision:"1bc6ca493fe6f5c6b503b2c355724fc1"},{url:"android-chrome-512x512.png",revision:"af060d04055c88fd8e04f717b1b97a4d"},{url:"apple-touch-icon.png",revision:"6463b41ee278185e17039ee140420136"},{url:"assets/bootstrap-icons-BOrJxbIo.woff",revision:null},{url:"assets/bootstrap-icons-BtvjY1KL.woff2",revision:null},{url:"assets/index-Booy0VzV.css",revision:null},{url:"assets/index-ChdwzMCW.js",revision:null},{url:"assets/workbox-window.prod.es5-D5gOYdM7.js",revision:null},{url:"favicon-16x16.png",revision:"24217a2484751a554813dfcd8e8a8b61"},{url:"favicon-32x32.png",revision:"4e9af50d2fafe63e2c13013f5dcfb98f"},{url:"favicon.ico",revision:"a06de80bbc35893a9bbbaf960fbd542e"},{url:"index.html",revision:"1bdc9517c842653d44a8a4f53ea98202"},{url:"logo_small_2.png",revision:"10f3cbc61488149d77c26291c8502d2f"},{url:"manifest.webmanifest",revision:"d603de6f3a1a2a36593ff1c4930b59c3"},{url:"pwa-192x192.png",revision:"1bc6ca493fe6f5c6b503b2c355724fc1"},{url:"pwa-512x512.png",revision:"af060d04055c88fd8e04f717b1b97a4d"},{url:"robots.txt",revision:"388ed88eec82ddeacbf877ee7dc4b225"},{url:"android-chrome-192x192.png",revision:"1bc6ca493fe6f5c6b503b2c355724fc1"},{url:"android-chrome-512x512.png",revision:"af060d04055c88fd8e04f717b1b97a4d"},{url:"apple-touch-icon.png",revision:"6463b41ee278185e17039ee140420136"},{url:"favicon-16x16.png",revision:"24217a2484751a554813dfcd8e8a8b61"},{url:"favicon-32x32.png",revision:"4e9af50d2fafe63e2c13013f5dcfb98f"},{url:"favicon.ico",revision:"a06de80bbc35893a9bbbaf960fbd542e"},{url:"logo_small_2.png",revision:"10f3cbc61488149d77c26291c8502d2f"},{url:"pwa-192x192.png",revision:"1bc6ca493fe6f5c6b503b2c355724fc1"},{url:"pwa-512x512.png",revision:"af060d04055c88fd8e04f717b1b97a4d"},{url:"robots.txt",revision:"388ed88eec82ddeacbf877ee7dc4b225"},{url:"manifest.webmanifest",revision:"d603de6f3a1a2a36593ff1c4930b59c3"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
