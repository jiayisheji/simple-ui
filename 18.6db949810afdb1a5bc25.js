(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{rt2f:function(e,t,i){"use strict";i.r(t),i.d(t,"PaginatorModule",(function(){return ae}));var n=i("sEIs"),a=i("M0ag"),s=i("2kYt"),o=i("EM62");let c=(()=>{class e{}return e.\u0275mod=o.Hb({type:e}),e.\u0275inj=o.Gb({factory:function(t){return new(t||e)},imports:[[s.c]]}),e})();var r=i("aiL/"),g=i("D57K"),p=i("ikI+"),l=i("ZgNe"),b=i("XWfW");let d=(()=>{class e{constructor(){this.nextPageLabel="\u4e0b\u4e00\u9875",this.previousPageLabel="\u4e0a\u4e00\u9875",this.increaseFivePageLabel="\u5411\u540e 5 \u9875",this.decreaseFivePageLabel="\u5411\u524d 5 \u9875",this.firstPageLabel="\u9996\u9875",this.lastPageLabel="\u5c3e\u9875",this.getRangeLabel=(e,t,i)=>{if(1===i||0===t)return"1 of "+i;const n=(e-1)*t;return`${n+1} \u2013 ${n<(i=Math.max(i,0))?Math.min(n+t,i):n+t} of ${i}`}}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275prov=o.Fb({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();const h={provide:d,deps:[[new o.A,new o.J,d]],useFactory:function(e){return e||new d}};var m=i("bpLA"),u=i("HfPG"),f=i("VJ3W");const x=["simPaginatorTotal"],v=["simPaginatorItem"];function z(e,t){if(1&e&&(o.Mb(0),o.xc(1),o.Lb()),2&e){const e=o.Yb(2);o.zb(1),o.zc(" ",e._rangeLabel," ")}}const I=function(e,t){return{$implicit:e,range:t}};function _(e,t){if(1&e&&(o.Ob(0,"div",4),o.vc(1,z,2,1,"ng-container",5),o.Nb()),2&e){const e=o.Yb();o.zb(1),o.ec("simStringTemplateOutlet",e.simPaginatorTotal)("simStringTemplateOutletContext",o.hc(2,I,e.pageTotal,e.ranges))}}function O(e,t){}const y=function(e){return{$implicit:e}};function w(e,t){if(1&e&&(o.Mb(0),o.vc(1,O,0,0,"ng-template",10),o.Lb()),2&e){const e=o.Yb().$implicit,t=o.Yb();o.zb(1),o.ec("ngTemplateOutlet",t.simPaginatorItem)("ngTemplateOutletContext",o.gc(2,y,e))}}function P(e,t){if(1&e&&(o.Mb(0),o.xc(1),o.Lb()),2&e){const e=o.Yb(2).$implicit;o.zb(1),o.yc(e.text)}}function S(e,t){if(1&e&&(o.Mb(0),o.xc(1),o.Lb()),2&e){const e=o.Yb(2).$implicit;o.zb(1),o.yc(e.text)}}function L(e,t){if(1&e&&(o.Mb(0),o.xc(1),o.Lb()),2&e){const e=o.Yb(2).$implicit;o.zb(1),o.yc(e.text)}}function T(e,t){1&e&&(o.Mb(0),o.Ob(1,"i",14),o.Xb(),o.Ob(2,"svg",15),o.Kb(3,"path",16),o.Nb(),o.Nb(),o.Lb())}function C(e,t){1&e&&(o.Mb(0),o.Ob(1,"i",14),o.Xb(),o.Ob(2,"svg",17),o.Kb(3,"path",18),o.Nb(),o.Nb(),o.Lb())}function k(e,t){1&e&&(o.Mb(0),o.Ob(1,"i",20),o.Xb(),o.Ob(2,"svg",21),o.Kb(3,"path",22),o.Nb(),o.Nb(),o.Lb())}function N(e,t){1&e&&(o.Mb(0),o.Ob(1,"i",20),o.Xb(),o.Ob(2,"svg",23),o.Kb(3,"path",24),o.Nb(),o.Nb(),o.Lb())}function M(e,t){if(1&e&&(o.Mb(0),o.Mb(1,11),o.vc(2,k,4,0,"ng-container",12),o.vc(3,N,4,0,"ng-container",12),o.Lb(),o.Ob(4,"span",19),o.xc(5,"\u2022\u2022\u2022"),o.Nb(),o.Lb()),2&e){const e=o.Yb(2).$implicit;o.zb(1),o.ec("ngSwitch",e.type),o.zb(1),o.ec("ngSwitchCase","prev_5"),o.zb(1),o.ec("ngSwitchCase","next_5")}}function j(e,t){if(1&e&&(o.Mb(0,11),o.vc(1,P,2,1,"ng-container",12),o.vc(2,S,2,1,"ng-container",12),o.vc(3,L,2,1,"ng-container",12),o.vc(4,T,4,0,"ng-container",12),o.vc(5,C,4,0,"ng-container",12),o.vc(6,M,6,3,"ng-container",13),o.Lb()),2&e){const e=o.Yb().$implicit;o.ec("ngSwitch",e.type),o.zb(1),o.ec("ngSwitchCase","first"),o.zb(1),o.ec("ngSwitchCase","last"),o.zb(1),o.ec("ngSwitchCase","page"),o.zb(1),o.ec("ngSwitchCase","prev"),o.zb(1),o.ec("ngSwitchCase","next")}}function F(e,t){if(1&e){const e=o.Pb();o.Ob(0,"li",6),o.Vb("click",(function(){o.lc(e);const i=t.$implicit;return o.Yb()._onPageIndexChange(i)})),o.Ob(1,"a",7),o.vc(2,w,2,4,"ng-container",8),o.vc(3,j,7,6,"ng-template",null,9,o.wc),o.Nb(),o.Nb()}if(2&e){const e=t.$implicit,i=o.jc(4),n=o.Yb();o.Bb("sim-paginator-item-disabled",e.disabled)("sim-paginator-item-active",n.pageIndex==e.index),o.Ab("title",e.title),o.zb(2),o.ec("ngIf",n.simPaginatorItem)("ngIfElse",i)}}function B(e,t){if(1&e&&(o.Ob(0,"sim-option",31),o.xc(1),o.Nb()),2&e){const e=t.$implicit;o.ec("value",e),o.zb(1),o.zc("",e," \u6761/\u9875")}}function D(e,t){if(1&e){const e=o.Pb();o.Ob(0,"div",28),o.Ob(1,"sim-select",29),o.Vb("selectionChange",(function(t){return o.lc(e),o.Yb(2)._onPageSizeChange(t.value)})),o.vc(2,B,2,2,"sim-option",30),o.Nb(),o.Nb()}if(2&e){const e=o.Yb(2);o.zb(1),o.ec("color",e.color)("value",e.pageSize),o.zb(1),o.ec("ngForOf",e._displayedPageSizeOptions)}}function J(e,t){if(1&e){const e=o.Pb();o.Ob(0,"div",32),o.xc(1," \u8df3\u81f3 "),o.Ob(2,"input",33,34),o.Vb("keydown.enter",(function(t){o.lc(e);const i=o.jc(3);return o.Yb(2)._handleKeyDown(t,i)})),o.Nb(),o.xc(4," \u9875 "),o.Nb()}if(2&e){const e=o.Yb(2);o.zb(2),o.ec("disabled",e.disabled)}}function $(e,t){if(1&e&&(o.Ob(0,"div",25),o.vc(1,D,3,3,"div",26),o.vc(2,J,5,1,"div",27),o.Nb()),2&e){const e=o.Yb();o.zb(1),o.ec("ngIf",!e.hidePageSize&&e._displayedPageSizeOptions.length>1),o.zb(1),o.ec("ngIf",!e.hideJumperPage)}}const Y=new o.q("SIM_PAGINATOR_DEFAULT_OPTIONS"),A=Object(l.mixinDisabled)(Object(l.mixinInitialized)(Object(l.mixinSize)(l.MixinElementRefBase,"medium")));let E=(()=>{class e extends A{constructor(e,t,i,n,a){if(super(e),this._intl=i,this._changeDetectorRef=n,this.pageSizeOptions=[10,20,30,40,50],this.hidePageSize=!0,this.hideJumperPage=!0,this.pageChange=new o.n,this.ranges=[0,0],this._displayedPageSizeOptions=[],this._firstIndex=1,this._pageIndex=this._firstIndex,this._pageSize=10,this._pageTotal=null,t.addClass(e.nativeElement,"sim-paginator"),a){const{pageSize:e,pageSizeOptions:t,hidePageSize:i,showFirstLastButtons:n,hideJumperPage:s}=a;null!=e&&(this._pageSize=e),null!=t&&(this.pageSizeOptions=t),null!=i&&(this.hidePageSize=i),null!=s&&(this.hideJumperPage=s),null!=n&&(this.showFirstLastButtons=n)}}get pageIndex(){return this._pageIndex}set pageIndex(e){if(this._pageIndex===e)return;const t=Object(p.c)(e,1);this._pageIndex=this._validatePageIndex(t,this._lastIndex),this._initialized&&this._buildIndexes(),this._changeDetectorRef.markForCheck()}get pageSize(){return this._pageSize}set pageSize(e){this._pageSize!==e&&(this._pageSize=Object(p.c)(e,10),this._updateDisplayedPageSizeOptions())}get pageTotal(){return this._pageTotal}set pageTotal(e){this._pageTotal!==e&&(this._pageTotal=Object(p.c)(e,0),this._initialized&&this._buildIndexes(),this._changeDetectorRef.markForCheck())}ngOnInit(){this._initialized=!0,this._buildIndexes(),this._updateDisplayedPageSizeOptions(),this.markInitialized()}_trackByPageItem(e,t){return`${t.type}-${t.index}`}_onPageIndexChange(e){this._goToPage({first:this._firstIndex,last:this._lastIndex,page:e.index,next:this.pageIndex+1,prev:this.pageIndex-1,prev_5:this.pageIndex-5,next_5:this.pageIndex+5}[e.type])}_onPageSizeChange(e){const t=this.pageIndex*this.pageSize,i=this.pageIndex;this.pageSize=e,this.pageIndex=Math.floor(t/e)||this._firstIndex,this._emitPageEvent(i),this.pageIndex===i&&this._buildIndexes()}_handleKeyDown(e,t){e&&e.stopPropagation();const i=Object(p.c)(t.value,this.pageIndex);this._goToPage(i),t.value=""}_updateDisplayedPageSizeOptions(){this._initialized&&(this.pageSize||(this._pageSize=0!==this.pageSizeOptions.length?this.pageSizeOptions[0]:10),this._displayedPageSizeOptions=this.pageSizeOptions.slice(),this._displayedPageSizeOptions=Array.from(new Set([...this._displayedPageSizeOptions,this.pageSize])).sort((e,t)=>e-t),this._changeDetectorRef.markForCheck())}_goToPage(e){let t=this.pageIndex;if(e===t)return;const i=this.pageIndex;t=e<this._firstIndex?this._firstIndex:e>this._lastIndex?this._lastIndex:e,this.pageIndex=t,this._emitPageEvent(i)}_buildIndexes(){this._lastIndex=0===this.pageTotal?1:this._getLastIndex(this.pageTotal,this.pageSize),this.ranges=this._getRange(this.pageIndex,this.pageSize,this.pageTotal),this.pages=this._getListOfPageItem(this.pageIndex,this._lastIndex),this._rangeLabel=this._intl.getRangeLabel(this.pageIndex,this.pageSize,this.pageTotal)}_getLastIndex(e,t){return Math.ceil(e/t)}_getListOfPageItem(e,t){const{nextPageLabel:i,previousPageLabel:n,firstPageLabel:a,lastPageLabel:s,increaseFivePageLabel:o,decreaseFivePageLabel:c}=this._intl,r=a=>[{type:"prev",title:n,text:n,disabled:e===this._firstIndex},...a,{type:"next",title:i,text:i,disabled:e===t}],g=(e,t)=>{const i=[];for(let n=e;n<=t;n++)i.push({index:n,type:"page",text:n+""});return i},p=(e,i)=>{if(i<=9)return g(this._firstIndex,i);let n=[];const a={type:"prev_5",title:c,text:c},s={type:"next_5",title:o,text:o},r=g(this._firstIndex,this._firstIndex),p=g(t,t);return n=e<4?[...g(2,5),s]:e<i-3?[a,...g(e-2,e+2),s]:[a,...g(i-4,i-1)],[...r,...n,...p]};return this.showFirstLastButtons?(i=>[{type:"first",title:a,text:a,disabled:e===this._firstIndex},...i,{type:"last",title:s,text:s,disabled:e===t}])(r(p(e,t))):r(p(e,t))}_validatePageIndex(e,t){return e>t?t:e<this._firstIndex?this._firstIndex:e}_getRange(e,t,i){return 0===i||0===t?[0,0]:[(e-1)*t+1,Math.min(e*t,i)]}_emitPageEvent(e){this.pageChange.emit({previousPageIndex:e,pageIndex:this.pageIndex,pageSize:this.pageSize,pageTotal:this.pageTotal})}}return e.\u0275fac=function(t){return new(t||e)(o.Jb(o.l),o.Jb(o.E),o.Jb(d),o.Jb(o.h),o.Jb(Y,8))},e.\u0275cmp=o.Db({type:e,selectors:[["sim-paginator"]],contentQueries:function(e,t,i){var n;1&e&&(o.Cb(i,x,!0),o.Cb(i,v,!0)),2&e&&(o.ic(n=o.Wb())&&(t.simPaginatorTotal=n.first),o.ic(n=o.Wb())&&(t.simPaginatorItem=n.first))},hostVars:2,hostBindings:function(e,t){2&e&&o.Bb("sim-paginator-disabled",t.disabled)},inputs:{color:"color",disabled:"disabled",size:"size",pageIndex:"pageIndex",pageSize:"pageSize",pageTotal:"pageTotal",pageSizeOptions:"pageSizeOptions",hidePageSize:"hidePageSize",hideJumperPage:"hideJumperPage",showFirstLastButtons:"showFirstLastButtons"},outputs:{pageChange:"pageChange"},features:[o.wb],decls:4,vars:4,consts:[["class","sim-paginator-label",4,"ngIf"],[1,"sim-paginator-range"],["class","sim-paginator-item",3,"sim-paginator-item-disabled","sim-paginator-item-active","click",4,"ngFor","ngForOf","ngForTrackBy"],["class","sim-paginator-actions",4,"ngIf"],[1,"sim-paginator-label"],[4,"simStringTemplateOutlet","simStringTemplateOutletContext"],[1,"sim-paginator-item",3,"click"],[1,"sim-paginator-item-link"],[4,"ngIf","ngIfElse"],["elseTemplate",""],[3,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"ngSwitch"],[4,"ngSwitchCase"],[4,"ngSwitchDefault"],[1,"sim-paginator-item-icon"],["viewBox","64 64 896 896","focusable","false","fill","currentColor","width","1em","height","1em","data-icon","left","aria-hidden","true"],["d","M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"],["viewBox","64 64 896 896","focusable","false","fill","currentColor","width","1em","height","1em","data-icon","right","aria-hidden","true"],["d","M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"],[1,"sim-paginator-item-ellipsis"],[1,"sim-paginator-item-icon","sim-paginator-item-jump-icon"],["viewBox","64 64 896 896","focusable","false","fill","currentColor","width","1em","height","1em","data-icon","double-left","aria-hidden","true"],["d","M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 000 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"],["viewBox","64 64 896 896","focusable","false","fill","currentColor","width","1em","height","1em","data-icon","double-right","aria-hidden","true"],["d","M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 00188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 00492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"],[1,"sim-paginator-actions"],["class","sim-paginator-size-changer",4,"ngIf"],["class","sim-paginator-page-jumper",4,"ngIf"],[1,"sim-paginator-size-changer"],[3,"color","value","selectionChange"],[3,"value",4,"ngFor","ngForOf"],[3,"value"],[1,"sim-paginator-page-jumper"],["type","number",1,"sim-paginator-page-jumper-input",3,"disabled","keydown.enter"],["quickJumperInput",""]],template:function(e,t){1&e&&(o.vc(0,_,2,5,"div",0),o.Ob(1,"ul",1),o.vc(2,F,5,7,"li",2),o.Nb(),o.vc(3,$,3,2,"div",3)),2&e&&(o.ec("ngIf",t._rangeLabel||t.simPaginatorTotal),o.zb(2),o.ec("ngForOf",t.pages)("ngForTrackBy",t._trackByPageItem),o.zb(1),o.ec("ngIf",!t.hidePageSize||!t.hideJumperPage))},directives:[s.t,s.s,m.a,s.A,s.x,s.y,s.z,u.b,f.b],styles:[".sim-paginator{display:flex}.sim-paginator-label{display:inline-block;margin-right:8px;vertical-align:middle}.sim-paginator-range{box-sizing:border-box;margin:0;padding:0;font-size:14px;line-height:1.5;list-style:none}.sim-paginator-item{display:inline-block;box-sizing:border-box;margin-right:8px;text-align:center;vertical-align:middle;list-style:none;border-style:solid;border-width:1px;border-radius:2px;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.sim-paginator-item:hover{transition:border-color .3s,color .3s}.sim-paginator-item-link{position:relative;display:block;padding:0 6px;color:inherit}.sim-paginator-item-link:focus{outline:0}.sim-paginator-item-icon{display:inline-block;color:inherit;font-style:normal;line-height:0;text-align:center;text-transform:none;vertical-align:-.125em;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.sim-paginator-item-jump-icon{font-size:12px;letter-spacing:-1px;opacity:0;transition:all .2s}.sim-paginator-item-ellipsis{position:absolute;top:0;right:0;bottom:0;left:0;margin:auto;color:rgba(0,0,0,.25);letter-spacing:2px;text-align:center;text-indent:.13em;opacity:1;transition:all .2s}.sim-paginator-item-link:hover .sim-paginator-item-ellipsis{opacity:0}.sim-paginator-item-link:hover .sim-paginator-item-jump-icon{opacity:1}.sim-paginator-item-active{font-weight:500}.sim-paginator-item-disabled{cursor:not-allowed}.sim-paginator-actions{display:inline-block;vertical-align:middle}.sim-paginator-size-changer{width:110px;margin-right:8px}.sim-paginator-page-jumper,.sim-paginator-size-changer{display:inline-block;height:32px;line-height:32px;vertical-align:top}.sim-paginator-page-jumper-input{position:relative;display:inline-block;width:50px;min-width:0;margin:0 8px;padding:4px 11px;font-size:14px;line-height:1.5715;border-style:solid;border-width:1px;border-radius:2px;transition:all .3s}.sim-paginator-page-jumper-input:focus{outline:0}"],encapsulation:2,changeDetection:0}),Object(g.a)([Object(b.a)(),Object(g.b)("design:type",Boolean)],e.prototype,"hidePageSize",void 0),Object(g.a)([Object(b.a)(),Object(g.b)("design:type",Boolean)],e.prototype,"hideJumperPage",void 0),Object(g.a)([Object(b.a)(),Object(g.b)("design:type",Boolean)],e.prototype,"showFirstLastButtons",void 0),e})();var R=i("Bo94"),V=i("QIPJ");let H=(()=>{class e{}return e.\u0275mod=o.Hb({type:e}),e.\u0275inj=o.Gb({factory:function(t){return new(t||e)},providers:[h],imports:[[s.c,R.a,V.a]]}),e})();var K=i("PBVc");let G=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["ng-component"]],decls:7,vars:0,template:function(e,t){1&e&&(o.Ob(0,"doc-playground-components"),o.Ob(1,"h1"),o.xc(2," Paginator "),o.Ob(3,"span"),o.xc(4,"\u5206\u9875\u5668"),o.Nb(),o.Nb(),o.Ob(5,"p"),o.xc(6,"\u4e3a\u5206\u9875\u4fe1\u606f\u63d0\u4f9b\u5bfc\u822a\u529f\u80fd\uff0c\u901a\u5e38\u548c\u8868\u683c\u4e00\u8d77\u7528\u3002"),o.Nb(),o.Nb())},directives:[K.a],styles:[""]}),e})(),W=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["doc-api"]],decls:2,vars:0,template:function(e,t){1&e&&(o.Ob(0,"p"),o.xc(1,"api works!"),o.Nb())},styles:[""]}),e})();function X(e,t){if(1&e&&o.xc(0),2&e){const e=t.range;o.Ac("",e[0],"-",e[1]," of ",t.$implicit," items")}}function q(e,t){if(1&e&&(o.Mb(0),o.xc(1),o.Lb()),2&e){const e=o.Yb().$implicit;o.zb(1),o.yc(e.text)}}function Q(e,t){1&e&&(o.Mb(0),o.xc(1,"Previous"),o.Lb())}function U(e,t){1&e&&(o.Mb(0),o.xc(1,"Next"),o.Lb())}function Z(e,t){1&e&&(o.Mb(0),o.xc(1,"\xab"),o.Lb())}function ee(e,t){1&e&&(o.Mb(0),o.xc(1,"\xbb"),o.Lb())}function te(e,t){1&e&&(o.Mb(0,4),o.vc(1,q,2,1,"ng-container",5),o.vc(2,Q,2,0,"ng-container",5),o.vc(3,U,2,0,"ng-container",5),o.vc(4,Z,2,0,"ng-container",5),o.vc(5,ee,2,0,"ng-container",5),o.Lb()),2&e&&(o.ec("ngSwitch",t.$implicit.type),o.zb(1),o.ec("ngSwitchCase","page"),o.zb(1),o.ec("ngSwitchCase","prev"),o.zb(1),o.ec("ngSwitchCase","next"),o.zb(1),o.ec("ngSwitchCase","prev_5"),o.zb(1),o.ec("ngSwitchCase","next_5"))}let ie=(()=>{class e{constructor(){this.pageIndex=0}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["doc-examples"]],decls:13,vars:6,consts:[[3,"pageIndex","pageTotal","pageChange"],["simPaginatorTotal",""],[3,"pageIndex","pageTotal"],["simPaginatorItem",""],[3,"ngSwitch"],[4,"ngSwitchCase"]],template:function(e,t){1&e&&(o.Ob(0,"p"),o.xc(1,"\u57fa\u672c\u5206\u9875"),o.Nb(),o.Ob(2,"sim-paginator",0),o.Vb("pageChange",(function(e){return t.pageIndex=e.pageIndex})),o.Nb(),o.Ob(3,"p"),o.xc(4,"\u81ea\u5b9a\u4e49\u6570\u636e\u63d0\u793a"),o.Nb(),o.Ob(5,"sim-paginator",0),o.Vb("pageChange",(function(e){return t.pageIndex=e.pageIndex})),o.vc(6,X,1,3,"ng-template",null,1,o.wc),o.Nb(),o.Ob(8,"p"),o.xc(9,"\u81ea\u5b9a\u4e49\u9875\u7801"),o.Nb(),o.Ob(10,"sim-paginator",2),o.vc(11,te,6,6,"ng-template",null,3,o.wc),o.Nb()),2&e&&(o.zb(2),o.ec("pageIndex",t.pageIndex)("pageTotal",500),o.zb(3),o.ec("pageIndex",t.pageIndex)("pageTotal",500),o.zb(5),o.ec("pageIndex",2)("pageTotal",500))},directives:[E,s.x,s.y],styles:[""]}),e})();const ne=[{path:"",component:G,children:[{path:"",redirectTo:"overview",pathMatch:"full"},{path:"overview",component:(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["doc-overview"]],decls:2,vars:0,template:function(e,t){1&e&&(o.Ob(0,"p"),o.xc(1,"overview works!"),o.Nb())},styles:[""]}),e})()},{path:"api",component:W},{path:"examples",component:ie}]}];let ae=(()=>{class e{}return e.\u0275mod=o.Hb({type:e}),e.\u0275inj=o.Gb({factory:function(t){return new(t||e)},imports:[[n.i.forChild(ne),H,a.a,r.a,c]]}),e})()}}]);