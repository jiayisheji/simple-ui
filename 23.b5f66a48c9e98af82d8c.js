(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{"U/Jk":function(e,t,i){"use strict";i.r(t),i.d(t,"DrawerModule",(function(){return ie}));var s=i("sEIs"),n=i("aiL/"),r=i("2kYt"),o=i("EM62");let a=(()=>{class e{}return e.\u0275mod=o.Hb({type:e}),e.\u0275inj=o.Gb({factory:function(t){return new(t||e)},imports:[[r.c]]}),e})();var c=i("M0ag"),d=i("D57K"),h=i("fAiE"),l=i("qvOF"),b=i("5lCh"),p=i("ikI+"),u=i("XWfW"),_=i("ZTXN"),m=i("KTx3"),f=i("g6G6"),w=i("xVbo"),g=i("7SLS"),O=i("YtkY"),k=i("kuMc"),v=i("Ohay"),C=i("J+dc"),x=i("jIqt"),D=i("mWib"),y=i("f7+R");const j={transformDrawer:Object(y.n)("transform",[Object(y.k)("open, open-instant",Object(y.l)({transform:"none",visibility:"visible"})),Object(y.k)("void",Object(y.l)({"box-shadow":"none",visibility:"hidden"})),Object(y.k)("stack",Object(y.l)({"box-shadow":"none",visibility:"hidden"})),Object(y.m)("void => open-instant",Object(y.e)("0ms")),Object(y.m)("void <=> open, open-instant => void",Object(y.e)("400ms cubic-bezier(0.25, 0.8, 0.25, 1)")),Object(y.m)("stack <=> open, open-instant => stack",Object(y.e)("0ms"))])};var N=i("sg/T"),S=i("cZZj");const z=["*"];function B(e,t){if(1&e){const e=o.Pb();o.Ob(0,"div",1),o.Vb("click",(function(){return o.lc(e),o.Yb()._onBackdropClicked()})),o.Nb()}if(2&e){const e=o.Yb();o.Bb("sim-drawer-shown",e._isShowingBackdrop())}}const F=[[["sim-drawer"]],[["sim-drawer-content"]]],E=["sim-drawer","sim-drawer-content"],M=".sim-drawer-container{position:relative;z-index:1;display:block;box-sizing:border-box;overflow:hidden;-webkit-overflow-scrolling:touch}.sim-drawer-container.sim-drawer-container-explicit-backdrop .sim-drawer-side{z-index:3}.sim-drawer-backdrop{position:absolute;top:0;right:0;bottom:0;left:0;z-index:3;display:block;visibility:hidden}.sim-drawer-backdrop.sim-drawer-shown{visibility:visible}.sim-drawer-transition .sim-drawer-backdrop{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-property:background-color,visibility}.sim-drawer-content{position:relative;z-index:1;display:block;height:100%;overflow:auto}.sim-drawer-transition .sim-drawer-content{transition-duration:.4s;transition-timing-function:cubic-bezier(.25,.8,.25,1);transition-transition-property:transform,margin-left,margin-right}.sim-drawer{position:absolute;top:0;bottom:0;z-index:4;display:block;box-sizing:border-box;overflow-y:auto;outline:0;transform:translate3d(-100%,0,0)}.sim-drawer.sim-drawer-side{z-index:2}.sim-drawer.sim-drawer-end{right:0;transform:translate3d(100%,0,0)}.sim-drawer-stack.sim-drawer-opened:not(:last-of-type){z-index:5;box-shadow:none}.sim-drawer.sim-drawer-vertical{right:0;bottom:auto;left:0;transform:translate3d(0,-100%,0)}.sim-drawer.sim-drawer-vertical.sim-drawer-end{top:auto;bottom:0;transform:translate3d(0,100%,0)}.sim-drawer-inner-container{width:100%;height:100%;overflow:auto;-webkit-overflow-scrolling:touch}",V=new o.q("SIM_DRAWER_CONTAINER");let I=(()=>{class e extends l.b{constructor(e,t,i,s,n){super(i,s,n),this._changeDetectorRef=e,this._container=t}ngAfterContentInit(){this._container._contentMarginChanges.subscribe(()=>{this._changeDetectorRef.markForCheck()})}}return e.\u0275fac=function(t){return new(t||e)(o.Jb(o.h),o.Jb(Object(o.T)(()=>J)),o.Jb(o.l),o.Jb(l.e),o.Jb(o.z))},e.\u0275cmp=o.Db({type:e,selectors:[["sim-drawer-content"]],hostAttrs:[1,"sim-drawer-content"],hostVars:4,hostBindings:function(e,t){2&e&&o.sc("margin-left",t._container._contentMargins.left,"px")("margin-right",t._container._contentMargins.right,"px")},features:[o.wb],ngContentSelectors:z,decls:1,vars:0,template:function(e,t){1&e&&(o.dc(),o.cc(0))},encapsulation:2,changeDetection:0}),e})(),A=(()=>{class e{constructor(e,t,i,s,n,r,a,c){this._elementRef=e,this.renderer=t,this._focusTrapFactory=i,this._focusMonitor=s,this._platform=n,this._ngZone=r,this._doc=a,this._container=c,this._opened=!1,this.disableClose=!1,this._position="right",this._mode="over",this.positionChanged=new o.n,this._animationStarted=new _.a,this._animationEnd=new _.a,this.openedChange=new o.n(!0),this.beforeClosed=this._animationStarted.pipe(Object(w.a)(e=>e.fromState!==e.toState&&["void","stack"].includes(e.toState)),Object(g.a)(void 0)),this.afterClosed=this.openedChange.pipe(Object(w.a)(e=>!e),Object(O.a)(()=>{})),this.beforeOpened=this._animationStarted.pipe(Object(w.a)(e=>e.fromState!==e.toState&&0===e.toState.indexOf("open")),Object(g.a)(void 0)),this.afterOpened=this.openedChange.pipe(Object(w.a)(e=>e),Object(O.a)(()=>{})),this._animationState="void",this._destroyed=new _.a,this._modeChanged=new _.a,this._elementFocusedBeforeDrawerWasOpened=null,this._enableAnimations=!1,this.openedChange.subscribe(e=>{e?(this._doc&&(this._elementFocusedBeforeDrawerWasOpened=this._doc.activeElement),this._takeFocus()):this._isFocusWithinDrawer()&&this._restoreFocus()}),this._ngZone.runOutsideAngular(()=>{Object(m.a)(this._elementRef.nativeElement,"keydown").pipe(Object(w.a)(e=>e.keyCode===h.g&&!this.disableClose&&!Object(h.q)(e)),Object(k.a)(this._destroyed)).subscribe(e=>this._ngZone.run(()=>{this.close(),e.stopPropagation(),e.preventDefault()}))}),this._animationEnd.pipe(Object(v.a)((e,t)=>e.fromState===t.fromState&&e.toState===t.toState)).subscribe(e=>{const{fromState:t,toState:i}=e;(0===i.indexOf("open")&&"void"===t||"void"===i&&0===t.indexOf("open"))&&this.openedChange.emit(this._opened)})}get opened(){return this._opened}set opened(e){this.toggle(Object(p.c)(e))}get position(){return this._position}set position(e){(e=["left","right","top","bottom"].includes(e)?e:"right")!==this._position&&(this._position=e,this.positionChanged.emit())}get autoFocus(){const e=this._autoFocus;return null==e?"side"!==this.mode:e}set autoFocus(e){this._autoFocus=Object(p.c)(e)}get mode(){return this._mode}set mode(e){this._mode=e,this._updateFocusTrapState(),this._modeChanged.next()}ngAfterContentInit(){this._platform.isBrowser&&(this._enableAnimations=!0),this._focusTrap=this._focusTrapFactory.create(this._elementRef.nativeElement),this._updateFocusTrapState()}ngOnDestroy(){this._focusTrap&&this._focusTrap.destroy(),this._animationStarted.complete(),this._animationEnd.complete(),this._modeChanged.complete(),this._destroyed.next(),this._destroyed.complete()}open(e){return this.toggle(!0,e)}close(){return this.toggle(!1)}toggle(e=!this.opened,t){return this._setOpen(e,!e&&this._isFocusWithinDrawer(),t)}_getZIndex(){const{nativeElement:e}=this._elementRef;return e&&+e.style.zIndex||4}_getWidth(){const{nativeElement:e}=this._elementRef;return e&&e.offsetWidth||0}_setStyle(e,t){this.renderer.setStyle(this._elementRef.nativeElement,e,t)}_setClass(e,t){t?this.renderer.addClass(this._elementRef.nativeElement,e):this.renderer.removeClass(this._elementRef.nativeElement,e)}_animationStartListener(e){this._animationStarted.next(e)}_animationDoneListener(e){this._animationEnd.next(e)}_closeViaBackdropClick(){return this._setOpen(!1,!0)}_setOpen(e,t,i="program"){return this._opened=e,e?(this._animationState=this._enableAnimations?"open":"open-instant",this._openedVia=i):(this._container&&this._container._onCloseStackDrawers(this),this._animationState="stack"===this.mode?"stack":"void",t&&this._restoreFocus()),this._updateFocusTrapState(),new Promise(e=>{this.openedChange.pipe(Object(C.a)(1)).subscribe(t=>e(t?"open":"close"))})}_isFocusWithinDrawer(){var e;const t=null===(e=this._doc)||void 0===e?void 0:e.activeElement;return!!t&&this._elementRef.nativeElement.contains(t)}_takeFocus(){this.autoFocus&&this._focusTrap&&this._focusTrap.focusInitialElementWhenReady().then(e=>{e||"function"!=typeof this._elementRef.nativeElement.focus||this._elementRef.nativeElement.focus()})}_restoreFocus(){this.autoFocus&&(this._elementFocusedBeforeDrawerWasOpened?this._focusMonitor.focusVia(this._elementFocusedBeforeDrawerWasOpened,this._openedVia):this._elementRef.nativeElement.blur(),this._elementFocusedBeforeDrawerWasOpened=null,this._openedVia=null)}_updateFocusTrapState(){this._focusTrap&&(this._focusTrap.enabled=this.opened&&"side"!==this.mode)}}return e.\u0275fac=function(t){return new(t||e)(o.Jb(o.l),o.Jb(o.E),o.Jb(N.f),o.Jb(N.h),o.Jb(S.a),o.Jb(o.z),o.Jb(r.e,8),o.Jb(V,8))},e.\u0275cmp=o.Db({type:e,selectors:[["sim-drawer"]],hostAttrs:["tabIndex","-1",1,"sim-drawer"],hostVars:18,hostBindings:function(e,t){1&e&&o.tc("@transform.start",(function(e){return t._animationStartListener(e)}))("@transform.done",(function(e){return t._animationDoneListener(e)})),2&e&&(o.Ab("align",null),o.uc("@transform",t._animationState),o.Bb("sim-drawer-end","right"===t.position||"bottom"===t.position)("sim-drawer-start","left"===t.position||"top"===t.position)("sim-drawer-over","over"===t.mode)("sim-drawer-push","push"===t.mode)("sim-drawer-side","side"===t.mode)("sim-drawer-stack","stack"===t.mode)("sim-drawer-opened",t.opened)("sim-drawer-vertical","over"===t.mode&&("top"===t.position||"bottom"===t.position)))},inputs:{opened:"opened",disableClose:"disableClose",position:"position",autoFocus:"autoFocus",mode:"mode"},outputs:{positionChanged:"positionChanged",openedChange:"openedChange",beforeClosed:"beforeClosed",afterClosed:"afterClosed",beforeOpened:"beforeOpened",afterOpened:"afterOpened"},exportAs:["simDrawer"],ngContentSelectors:z,decls:2,vars:0,consts:[[1,"sim-drawer-inner-container"]],template:function(e,t){1&e&&(o.dc(),o.Ob(0,"div",0),o.cc(1),o.Nb())},styles:[M],encapsulation:2,data:{animation:[j.transformDrawer]},changeDetection:0}),Object(d.a)([Object(u.a)(),Object(d.b)("design:type",Boolean)],e.prototype,"disableClose",void 0),e})(),J=(()=>{class e{constructor(e,t,i,s,n){this._element=e,this._ngZone=t,this._changeDetectorRef=i,this._animationMode=n,this.backdropClick=new o.n,this._drawers=new o.D,this._contentMargins={left:null,right:null},this._contentMarginChanges=new _.a,this._destroyed=new _.a,this._doCheckSubject=new _.a,s.change().pipe(Object(k.a)(this._destroyed)).subscribe(()=>this.updateContentMargins())}get autosize(){return this._autosize}set autosize(e){this._autosize=Object(p.c)(e)}get hasBackdrop(){return this._hasBackdrop}set hasBackdrop(e){this._hasBackdrop=Object(p.c)(e)}get start(){return this._start}get end(){return this._end}get scrollable(){return this._content}ngAfterContentInit(){this._allDrawers.changes.pipe(Object(x.a)(this._allDrawers),Object(k.a)(this._destroyed)).subscribe(e=>{this._drawers.reset(e.filter(e=>!e._container||e._container===this)),this._drawers.notifyOnChanges()}),this._drawers.changes.pipe(Object(x.a)(null)).subscribe(()=>{this._validateDrawers(),this._drawers.forEach(e=>{this._watchDrawerToggle(e),this._watchDrawerPosition(e),this._watchDrawerMode(e)}),(!this._drawers.length||this._isDrawerOpen(this._start)||this._isDrawerOpen(this._end))&&this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),this._ngZone.runOutsideAngular(()=>{this._doCheckSubject.pipe(Object(D.a)(10),Object(k.a)(this._destroyed)).subscribe(()=>this.updateContentMargins())})}ngDoCheck(){this._autosize&&this._isPushed()&&this._ngZone.runOutsideAngular(()=>this._doCheckSubject.next())}ngOnDestroy(){this._drawers.destroy(),this._destroyed.next(),this._destroyed.complete()}updateContentMargins(){let e=0,t=0;if(this._left&&this._left.opened)if("side"===this._left.mode)e+=this._left._getWidth();else if("push"===this._left.mode){const i=this._left._getWidth();e+=i,t-=i}if(this._right&&this._right.opened)if("side"===this._right.mode)t+=this._right._getWidth();else if("push"===this._right.mode){const i=this._right._getWidth();t+=i,e-=i}e=e||null,t=t||null,e===this._contentMargins.left&&t===this._contentMargins.right||(this._contentMargins={left:e,right:t},this._ngZone.run(()=>this._contentMarginChanges.next(this._contentMargins)))}_onCloseStackDrawers(e){if("stack"===e.mode&&this._stackDrawers&&this._stackDrawers.length>1){const t=this._stackDrawers[e._stackIndex+1];t&&t.close()}}_onBackdropClicked(){this.backdropClick.emit(),this._closeModalDrawersViaBackdrop()}_isShowingBackdrop(){return this._isDrawerOpen(this._start)&&this._canHaveBackdrop(this._start)||this._isDrawerOpen(this._end)&&this._canHaveBackdrop(this._end)}_closeModalDrawersViaBackdrop(){this._stackDrawers&&this._stackDrawers.reduceRight((e,t)=>(t._closeViaBackdropClick(),e),null),[this._start,this._end].filter(e=>e&&!e.disableClose&&this._canHaveBackdrop(e)).forEach(e=>e._closeViaBackdropClick())}_canHaveBackdrop(e){return"side"!==e.mode||!!this._hasBackdrop}_validateDrawers(){if(this._start=this._end=null,this._stackDrawers=[],this._drawers.forEach(e=>{if("stack"===e.mode&&!["right","left"].includes(e.position))throw Error("A drawer was declared for 'position=\"right\"' or 'position=\"left\"'");if("right"===e.position||"bottom"===e.position)if("stack"===e.mode){if(null!=this._start)throw Error("All stack drawer was declared for 'position=\"left\"'");this._end?this._end.position===e.position&&this._stackDrawers.push(e):(this._end=e,this._stackDrawers.push(e))}else{if(null!=this._end)throw Error("A drawer was already declared for 'position=\"right\"'");this._end=e}else if("stack"===e.mode){if(null!=this._end)throw Error("All stack drawer was declared for 'position=\"right\"'");this._start?this._start.position===e.position&&this._stackDrawers.push(e):(this._start=e,this._stackDrawers.push(e))}else{if(null!=this._start)throw Error("A drawer was already declared for 'position=\"left\"'");this._start=e}}),this._stackDrawers&&this._stackDrawers.length>1){const e=this._end||this._start,t=e.position;null==this._stackStartDrawerZIndex&&(this._stackStartDrawerZIndex=e._getZIndex());const i=this._stackDrawers.length+this._stackStartDrawerZIndex;this._stackDrawers.reduce((e,s,n)=>(e>0&&s._setStyle("margin-"+t,e+"px"),s._stackIndex=n,s._setStyle("z-index",i-n),e+s._getWidth()),0)}this._right=this._left=null,this._left=this._start,this._right=this._end}_watchDrawerPosition(e){e&&e.positionChanged.pipe(Object(k.a)(this._drawers.changes)).subscribe(()=>{this._ngZone.onMicrotaskEmpty.pipe(Object(C.a)(1)).subscribe(()=>{this._validateDrawers()})})}_watchDrawerMode(e){e&&e._modeChanged.pipe(Object(k.a)(Object(f.a)(this._drawers.changes,this._destroyed))).subscribe(()=>{this.updateContentMargins(),this._changeDetectorRef.markForCheck()})}_watchDrawerToggle(e){e._animationStarted.pipe(Object(w.a)(e=>e.fromState!==e.toState),Object(k.a)(this._drawers.changes)).subscribe(e=>{"open-instant"!==e.toState&&"NoopAnimations"!==this._animationMode&&this._element.nativeElement.classList.add("sim-drawer-transition"),this.updateContentMargins(),this._changeDetectorRef.markForCheck()}),"side"!==e.mode&&e.openedChange.pipe(Object(k.a)(this._drawers.changes)).subscribe(()=>this._setContainerClass(e.opened))}_setContainerClass(e){const t=this._element.nativeElement.classList,i="sim-drawer-container-has-open";e?t.add(i):t.remove(i)}_isPushed(){return this._isDrawerOpen(this._start)&&"over"!==this._start.mode||this._isDrawerOpen(this._end)&&"over"!==this._end.mode}_isDrawerOpen(e){return null!=e&&e.opened}}return e.\u0275fac=function(t){return new(t||e)(o.Jb(o.l),o.Jb(o.z),o.Jb(o.h),o.Jb(l.g),o.Jb(b.a,8))},e.\u0275cmp=o.Db({type:e,selectors:[["sim-drawer-container"]],contentQueries:function(e,t,i){var s;1&e&&(o.Cb(i,I,!0),o.Cb(i,A,!1)),2&e&&(o.ic(s=o.Wb())&&(t._content=s.first),o.ic(s=o.Wb())&&(t._allDrawers=s))},hostAttrs:[1,"sim-drawer-container"],hostVars:2,hostBindings:function(e,t){2&e&&o.Bb("sim-drawer-container-explicit-backdrop",t._backdropOverride)},inputs:{autosize:"autosize",hasBackdrop:"hasBackdrop"},outputs:{backdropClick:"backdropClick"},exportAs:["simDrawerContainer"],features:[o.yb([{provide:V,useExisting:e}])],ngContentSelectors:E,decls:3,vars:1,consts:[["class","sim-drawer-backdrop",3,"sim-drawer-shown","click",4,"ngIf"],[1,"sim-drawer-backdrop",3,"click"]],template:function(e,t){1&e&&(o.dc(F),o.vc(0,B,1,2,"div",0),o.cc(1),o.cc(2,1)),2&e&&o.ec("ngIf",t.hasBackdrop)},directives:[r.t],styles:[M],encapsulation:2,changeDetection:0}),e})(),P=(()=>{class e{}return e.\u0275mod=o.Hb({type:e}),e.\u0275inj=o.Gb({factory:function(t){return new(t||e)},imports:[[r.c]]}),e})();var R=i("QIPJ");let W=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["doc-api"]],decls:2,vars:0,template:function(e,t){1&e&&(o.Ob(0,"p"),o.xc(1,"api works!"),o.Nb())},styles:[""]}),e})();var T=i("PBVc");let Z=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["ng-component"]],decls:7,vars:0,template:function(e,t){1&e&&(o.Ob(0,"doc-playground-components"),o.Ob(1,"h1"),o.xc(2," Drawer "),o.Ob(3,"span"),o.xc(4,"\u62bd\u5c49"),o.Nb(),o.Nb(),o.Ob(5,"p"),o.xc(6,"\u62bd\u5c49\u4ece\u7236\u7a97\u4f53\u8fb9\u7f18\u6ed1\u5165\uff0c\u8986\u76d6\u4f4f\u90e8\u5206\u7236\u7a97\u4f53\u5185\u5bb9\u3002\u7528\u6237\u5728\u62bd\u5c49\u5185\u64cd\u4f5c\u65f6\u4e0d\u5fc5\u79bb\u5f00\u5f53\u524d\u4efb\u52a1\uff0c\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u53ef\u4ee5\u5e73\u6ed1\u5730\u56de\u5230\u5230\u539f\u4efb\u52a1\u3002"),o.Nb(),o.Nb())},directives:[T.a],styles:[""]}),e})(),H=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["doc-examples"]],decls:2,vars:0,template:function(e,t){1&e&&(o.Ob(0,"p"),o.xc(1,"examples works!"),o.Nb())},styles:[""]}),e})();var L=i("HfPG"),G=i("VJ3W");function Y(e,t){if(1&e&&(o.Ob(0,"sim-option",13),o.xc(1),o.Nb()),2&e){const e=t.$implicit;o.ec("value",e),o.zb(1),o.zc(" ",e," ")}}function q(e,t){if(1&e&&(o.Ob(0,"sim-option",13),o.xc(1),o.Nb()),2&e){const e=t.$implicit;o.ec("value",e),o.zb(1),o.zc(" ",e," ")}}function $(e,t){if(1&e&&(o.Ob(0,"sim-option",13),o.xc(1),o.Nb()),2&e){const e=t.$implicit;o.ec("value",e),o.zb(1),o.zc(" ",e," ")}}function K(e,t){if(1&e&&(o.Ob(0,"sim-option",13),o.xc(1),o.Nb()),2&e){const e=t.$implicit;o.ec("value",e),o.zb(1),o.zc(" ",e," ")}}const Q=function(){return["right","left"]},X=function(){return["top","right","bottom","left"]},U=function(){return["left","right"]},ee=function(){return["side","push"]},te=[{path:"",component:Z,children:[{path:"",redirectTo:"overview",pathMatch:"full"},{path:"overview",component:(()=>{class e{constructor(){this.stackPosition="right",this.overPosition="right",this.mode="side",this.position="left"}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=o.Db({type:e,selectors:[["doc-overview"]],decls:75,vars:21,consts:[["hasBackdrop","",1,"example-container"],["mode","stack",3,"position"],["drawer",""],[1,"example-drawer"],[3,"click"],["drawer1",""],["drawer2",""],["color","primary",3,"value","valueChange"],[3,"value",4,"ngFor","ngForOf"],["mode","over",3,"position"],["drawer3",""],[1,"example-container",3,"hasBackdrop","backdropClick"],[3,"mode","position","opened"],[3,"value"]],template:function(e,t){if(1&e){const e=o.Pb();o.Ob(0,"sim-drawer-container",0),o.Ob(1,"sim-drawer",1,2),o.Ob(3,"div",3),o.Ob(4,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(2).close()})),o.xc(5,"close drawer"),o.Nb(),o.Ob(6,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(9).open()})),o.xc(7,"open drawer1"),o.Nb(),o.Nb(),o.Nb(),o.Ob(8,"sim-drawer",1,5),o.Ob(10,"div",3),o.Ob(11,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(9).close()})),o.xc(12,"close drawer1"),o.Nb(),o.Ob(13,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(16).open()})),o.xc(14,"open drawer2"),o.Nb(),o.Nb(),o.Nb(),o.Ob(15,"sim-drawer",1,6),o.Ob(17,"div",3),o.Ob(18,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(16).close()})),o.xc(19,"close drawer2"),o.Nb(),o.Nb(),o.Nb(),o.Ob(20,"sim-drawer-content"),o.Ob(21,"h3"),o.xc(22,"stack drawer"),o.Nb(),o.Ob(23,"ul"),o.Ob(24,"li"),o.xc(25,"\u53ef\u4ee5\u540c\u65f6\u652f\u6301\u591a\u4e2adrawer"),o.Nb(),o.Ob(26,"li"),o.xc(27,"\u53ea\u652f\u6301left/right\u65b9\u5411"),o.Nb(),o.Ob(28,"li"),o.xc(29,"\u591a\u4e2adrawer\u4fdd\u8bc1\u65b9\u5411\u4e00\u81f4"),o.Nb(),o.Nb(),o.Ob(30,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(2).open()})),o.xc(31,"open drawer"),o.Nb(),o.Ob(32,"sim-select",7),o.Vb("valueChange",(function(e){return t.stackPosition=e})),o.vc(33,Y,2,2,"sim-option",8),o.Nb(),o.Nb(),o.Nb(),o.Ob(34,"sim-drawer-container",0),o.Ob(35,"sim-drawer",9,10),o.Ob(37,"div",3),o.Ob(38,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(36).close()})),o.xc(39,"close drawer"),o.Nb(),o.Nb(),o.Nb(),o.Ob(40,"sim-drawer-content"),o.Ob(41,"h3"),o.xc(42,"over drawer"),o.Nb(),o.Ob(43,"ul"),o.Ob(44,"li"),o.xc(45,"\u53ef\u4ee5\u4e00\u4e2adrawer"),o.Nb(),o.Ob(46,"li"),o.xc(47,"\u652f\u6301left/right/top/bottom\u65b9\u5411"),o.Nb(),o.Nb(),o.Ob(48,"button",4),o.Vb("click",(function(){return o.lc(e),o.jc(36).open()})),o.xc(49,"drawer"),o.Nb(),o.Ob(50,"sim-select",7),o.Vb("valueChange",(function(e){return t.overPosition=e})),o.vc(51,q,2,2,"sim-option",8),o.Nb(),o.Nb(),o.Nb(),o.Ob(52,"sim-drawer-container",11),o.Vb("backdropClick",(function(){return t.drawerOpen=!1})),o.Ob(53,"sim-drawer",12),o.Ob(54,"div",3),o.Ob(55,"button",4),o.Vb("click",(function(){return t.drawerOpen=!1})),o.xc(56,"close drawer"),o.Nb(),o.Nb(),o.Nb(),o.Ob(57,"sim-drawer-content"),o.Ob(58,"h3"),o.xc(59,"side and push drawer"),o.Nb(),o.Ob(60,"ul"),o.Ob(61,"li"),o.xc(62,"\u53ef\u4ee5\u4e00\u4e2adrawer"),o.Nb(),o.Ob(63,"li"),o.xc(64,"\u652f\u6301left/right\u65b9\u5411"),o.Nb(),o.Nb(),o.Ob(65,"p"),o.xc(66," \u62bd\u5c49\u4ece\u7236\u7a97\u4f53\u8fb9\u7f18\u6ed1\u5165\uff0c\u8986\u76d6\u4f4f\u90e8\u5206\u7236\u7a97\u4f53\u5185\u5bb9\u3002\u7528\u6237\u5728\u62bd\u5c49\u5185\u64cd\u4f5c\u65f6\u4e0d\u5fc5\u79bb\u5f00\u5f53\u524d\u4efb\u52a1\uff0c\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u53ef\u4ee5\u5e73\u6ed1\u5730\u56de\u5230\u5230\u539f\u4efb\u52a1\u3002\u62bd\u5c49\u4ece\u7236\u7a97\u4f53\u8fb9\u7f18\u6ed1\u5165\uff0c\u8986\u76d6\u4f4f\u90e8\u5206\u7236\u7a97\u4f53\u5185\u5bb9\u3002\u7528\u6237\u5728\u62bd\u5c49\u5185\u64cd\u4f5c\u65f6\u4e0d\u5fc5\u79bb\u5f00\u5f53\u524d\u4efb\u52a1\uff0c\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u53ef\u4ee5\u5e73\u6ed1\u5730\u56de\u5230\u5230\u539f\u4efb\u52a1\u3002\u62bd\u5c49\u4ece\u7236\u7a97\u4f53\u8fb9\u7f18\u6ed1\u5165\uff0c\u8986\u76d6\u4f4f\u90e8\u5206\u7236\u7a97\u4f53\u5185\u5bb9\u3002\u7528\u6237\u5728\u62bd\u5c49\u5185\u64cd\u4f5c\u65f6\u4e0d\u5fc5\u79bb\u5f00\u5f53\u524d\u4efb\u52a1\uff0c\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u53ef\u4ee5\u5e73\u6ed1\u5730\u56de\u5230\u5230\u539f\u4efb\u52a1\u3002\u62bd\u5c49\u4ece\u7236\u7a97\u4f53\u8fb9\u7f18\u6ed1\u5165\uff0c\u8986\u76d6\u4f4f\u90e8\u5206\u7236\u7a97\u4f53\u5185\u5bb9\u3002\u7528\u6237\u5728\u62bd\u5c49\u5185\u64cd\u4f5c\u65f6\u4e0d\u5fc5\u79bb\u5f00\u5f53\u524d\u4efb\u52a1\uff0c\u64cd\u4f5c\u5b8c\u6210\u540e\uff0c\u53ef\u4ee5\u5e73\u6ed1\u5730\u56de\u5230\u5230\u539f\u4efb\u52a1\u3002 "),o.Nb(),o.Ob(67,"p"),o.xc(68),o.Nb(),o.Ob(69,"button",4),o.Vb("click",(function(){return t.drawerOpen=!t.drawerOpen})),o.xc(70,"drawer"),o.Nb(),o.Ob(71,"sim-select",7),o.Vb("valueChange",(function(e){return t.position=e})),o.vc(72,$,2,2,"sim-option",8),o.Nb(),o.Ob(73,"sim-select",7),o.Vb("valueChange",(function(e){return t.mode=e})),o.vc(74,K,2,2,"sim-option",8),o.Nb(),o.Nb(),o.Nb()}2&e&&(o.zb(1),o.ec("position",t.stackPosition),o.zb(7),o.ec("position",t.stackPosition),o.zb(7),o.ec("position",t.stackPosition),o.zb(17),o.ec("value",t.stackPosition),o.zb(1),o.ec("ngForOf",o.fc(17,Q)),o.zb(2),o.ec("position",t.overPosition),o.zb(15),o.ec("value",t.overPosition),o.zb(1),o.ec("ngForOf",o.fc(18,X)),o.zb(1),o.ec("hasBackdrop","push"===t.mode),o.zb(1),o.ec("mode",t.mode)("position",t.position)("opened",t.drawerOpen),o.zb(15),o.zc("drawerOpen: ",t.drawerOpen,""),o.zb(3),o.ec("value",t.position),o.zb(1),o.ec("ngForOf",o.fc(19,U)),o.zb(1),o.ec("value",t.mode),o.zb(1),o.ec("ngForOf",o.fc(20,ee)))},directives:[J,A,I,L.b,r.s,G.b],styles:[".example-container[_ngcontent-%COMP%]{height:500px}.example-container[_ngcontent-%COMP%]   .sim-select[_ngcontent-%COMP%]{width:200px;margin-left:10px}"]}),e})()},{path:"api",component:W},{path:"examples",component:H}]}];let ie=(()=>{class e{}return e.\u0275mod=o.Hb({type:e}),e.\u0275inj=o.Gb({factory:function(t){return new(t||e)},imports:[[s.i.forChild(te),P,c.a,R.a,n.a,a]]}),e})()}}]);