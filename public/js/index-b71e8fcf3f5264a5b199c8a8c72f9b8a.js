!function(){"use strict";const e=fetch("/revisionedFiles").then((e=>e.json())),o=`${window.location.protocol}//${window.location.host}`,t=new Promise(((e,t)=>{const s=document.createElement("script");document.head.appendChild(s),s.onload=e,s.onerror=t,s.async=!0,s.src=o+"/js/fetch-inject.min.js?v=2.0.4"}));Promise.all([e,t]).then((e=>{const t=e[0],s=document.querySelector("body");fetchInject(["https://fonts.googleapis.com/css?family=Montserrat:700|Noto+Serif:400,400i,400b|Source+Sans+Pro:400,600|Source+Code+Pro:700&display=swap"]).then((()=>{null!==s&&(s.style.opacity="1")}),(()=>{null!==s&&(s.style.opacity="1")})),fetchInject([`${o}/${t.js["js/responsiveMenu.js"]}`,`${o}/${t.js["js/rest.js"]}`])}))}();
