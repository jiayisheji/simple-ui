(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{j1ZV:function(n,o,e){"use strict";e.r(o),e.d(o,"ComponentsModule",(function(){return x}));var t=e("2kYt"),c=e("iR/r"),i=e("sEIs");e("ikI+"),e("Bhpx"),Symbol&&Symbol;const a=[{path:"",name:"\u901a\u7528",children:[{path:"button",name:"\u6309\u94ae"},{path:"divider",name:"\u5206\u5272\u7ebf"}]},{path:"",name:"\u6570\u636e\u5c55\u793a",children:[]},{path:"",name:"\u53cd\u9988",children:[{path:"alert",name:"\u8b66\u544a\u63d0\u793a"}]}];var d=e("EM62"),l=e("xSaA");function r(n,o){if(1&n&&(d.Nb(0),d.Pb(1,"a"),d.wc(2),d.Ob(),d.Mb()),2&n){const n=d.Zb().$implicit;d.zb(1),d.Ab("href",n.link,d.nc),d.zb(1),d.xc(n.name)}}function p(n,o){if(1&n&&(d.Nb(0),d.Pb(1,"a",15),d.wc(2),d.Ob(),d.Mb()),2&n){const n=d.Zb(2).$implicit;d.zb(1),d.fc("routerLink",n.path),d.zb(1),d.xc(n.name)}}function s(n,o){if(1&n&&(d.Pb(0,"span"),d.wc(1),d.Ob()),2&n){const n=d.Zb(2).$implicit;d.zb(1),d.xc(n.name)}}function b(n,o){if(1&n&&(d.uc(0,p,3,2,"ng-container",10),d.uc(1,s,2,1,"ng-template",null,14,d.vc)),2&n){const n=d.kc(2),o=d.Zb().$implicit;d.fc("ngIf",o.path)("ngIfElse",n)}}const m=function(){return["doc-nav-item-selected"]},h=function(n){return[n]};function u(n,o){if(1&n){const n=d.Qb();d.Pb(0,"li",16),d.Vb("click",(function(){d.mc(n);const e=o.$implicit;return d.Zb(2).setHeadline(e)})),d.Pb(1,"a",15),d.wc(2),d.Ob(),d.Ob()}if(2&n){const n=o.$implicit;d.fc("routerLinkActive",d.gc(3,m)),d.zb(1),d.fc("routerLink",d.hc(4,h,n.path)),d.zb(1),d.xc(n.name)}}function v(n,o){if(1&n&&(d.Pb(0,"li",8),d.Pb(1,"div",9),d.uc(2,r,3,2,"ng-container",10),d.uc(3,b,3,2,"ng-template",null,11,d.vc),d.Kb(5,"sim-divider"),d.Ob(),d.Pb(6,"ul",12),d.uc(7,u,3,6,"li",13),d.Ob(),d.Ob()),2&n){const n=o.$implicit,e=d.kc(4);d.zb(2),d.fc("ngIf",n.link)("ngIfElse",e),d.zb(5),d.fc("ngForOf",n.children)}}const f=[{path:"",component:(()=>{class n{constructor(){this.headline="\u7ec4\u4ef6",this.subheading="Components",this.components=a}ngOnInit(){}setHeadline(n){var o;this.headline=n.name,this.subheading=n.path?(o=n.path).charAt(0).toUpperCase()+o.substr(1):""}}return n.\u0275fac=function(o){return new(o||n)},n.\u0275cmp=d.Db({type:n,selectors:[["doc-components"]],decls:13,vars:3,consts:[[1,"doc-component-container"],[1,"doc-component-header"],[1,"sim-display3"],[1,"doc-component-content"],[1,"doc-component-nav"],[1,"doc-component-nav-content"],[1,"doc-nav-list"],["class","doc-nav-item",4,"ngFor","ngForOf"],[1,"doc-nav-item"],[1,"doc-nav-item-title"],[4,"ngIf","ngIfElse"],["linkTemplate",""],[1,"doc-sidenav"],["class","doc-sidenav-item",3,"routerLinkActive","click",4,"ngFor","ngForOf"],["pathTemplate",""],[3,"routerLink"],[1,"doc-sidenav-item",3,"routerLinkActive","click"]],template:function(n,o){1&n&&(d.Pb(0,"div",0),d.Pb(1,"header",1),d.Pb(2,"h1",2),d.wc(3),d.Pb(4,"small"),d.wc(5),d.Ob(),d.Ob(),d.Ob(),d.Pb(6,"main",3),d.Pb(7,"div"),d.Pb(8,"div",4),d.Pb(9,"div",5),d.Pb(10,"ul",6),d.uc(11,v,8,3,"li",7),d.Ob(),d.Ob(),d.Ob(),d.Ob(),d.Kb(12,"router-outlet"),d.Ob(),d.Ob()),2&n&&(d.zb(3),d.yc(" ",o.headline," "),d.zb(2),d.xc(o.subheading),d.zb(6),d.fc("ngForOf",o.components))},directives:[t.s,i.g,t.t,l.a,i.e,i.d],styles:["doc-components{position:relative;z-index:1;display:block;box-sizing:border-box;overflow:hidden;-webkit-overflow-scrolling:touch}.doc-component-container{position:relative;z-index:1;display:flex;flex:1;flex-direction:column;height:100%;overflow:auto}.doc-component-header{display:flex;align-items:center;padding-left:20px;background:#3949ab}.doc-component-header h1{margin:0;padding:28px 8px;color:#fff;font-weight:300;font-size:20px}.doc-component-header small{margin-left:5px;color:#d3d3d3}.doc-component-content{display:flex;flex:1 1 auto}.doc-component-nav{position:-webkit-sticky;position:sticky;top:0}.doc-component-nav-content{width:240px;height:100vh;overflow:auto;border-right:1px solid rgba(0,0,0,.12)}.doc-component-nav-content::-webkit-scrollbar{width:4px;height:4px}.doc-component-nav-content::-webkit-scrollbar-thumb{background:rgba(0,0,0,.26)}.doc-component-nav ul{padding:0;list-style-type:none}.doc-component-nav a{display:block;color:rgba(0,0,0,.54);text-decoration:none}.doc-component-nav a:hover{color:rgba(0,0,0,.87);background:rgba(0,0,0,.04)}.doc-component-nav .sim-divider{margin:0 16px 0 24px}.doc-component-nav .doc-nav-item-title{margin:16px 0;line-height:36px}.doc-component-nav .doc-sidenav-item{height:40px;line-height:40px}.doc-component-nav .doc-nav-item a,.doc-component-nav .doc-nav-item span,.doc-component-nav .doc-sidenav-item a,.doc-component-nav .doc-sidenav-item span{display:block;padding:0 16px 0 24px}.doc-component-nav .doc-nav-item span,.doc-component-nav .doc-sidenav-item span{color:rgba(0,0,0,.38)}.doc-component-nav .doc-nav-item-selected{background:rgba(63,81,181,.15)}.doc-component-nav .doc-nav-item-selected a,.doc-component-nav .doc-nav-item-selected a:hover{color:#3f51b5}.doc-component-nav .doc-nav-item-selected:hover{background:rgba(63,81,181,.3)}.doc-component-container router-outlet+ng-component{flex-grow:1;padding:20px 50px}doc-playground-components{display:block}"],encapsulation:2}),n})(),children:[{path:"",redirectTo:"button",pathMatch:"full"},{path:"button",loadChildren:()=>Promise.all([e.e(2),e.e(0),e.e(7)]).then(e.bind(null,"CPbx")).then(n=>n.ButtonModule)},{path:"divider",loadChildren:()=>Promise.all([e.e(2),e.e(9)]).then(e.bind(null,"oeW4")).then(n=>n.DividerModule)},{path:"alert",loadChildren:()=>Promise.all([e.e(2),e.e(0),e.e(6)]).then(e.bind(null,"eKL1")).then(n=>n.AlertModule)}]}];let g=(()=>{class n{}return n.\u0275mod=d.Hb({type:n}),n.\u0275inj=d.Gb({factory:function(o){return new(o||n)},imports:[[i.f.forChild(f)],i.f]}),n})(),x=(()=>{class n{}return n.\u0275mod=d.Hb({type:n}),n.\u0275inj=d.Gb({factory:function(o){return new(o||n)},imports:[[c.a,t.c,g]]}),n})()}}]);