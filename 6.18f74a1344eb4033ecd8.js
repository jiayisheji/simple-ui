(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{Pg5x:function(t,e,i){"use strict";i.d(e,"a",(function(){return F})),i.d(e,"b",(function(){return J}));var s=i("AytR"),o=i("EM62"),n=i("BeyH"),r=i("D57K"),a=i("Sv/w"),l=i("ikI+"),h=i("ZgNe"),c=i("XWfW"),p=i("WLkT"),g=i("J+dc"),u=i("kuMc"),b=i("mluz"),d=i("HYj3"),m=i("qvOF");const _=new o.q("SIM_TOOLTIP_DEFAULT_OPTIONS",{providedIn:"root",factory:function(){return{showDelay:0,hideDelay:0}}}),f=Object(h.mixinUnsubscribe)(h.MixinElementRefBase),y={end:"start",start:"end"},v={top:"bottom",bottom:"top"};let w=(()=>{class t extends f{constructor(t,e,i,s,o,n,r){super(t),this._overlay=e,this._renderer=i,this._ngZone=s,this._viewContainerRef=o,this._scrollDispatcher=n,this._defaultOptions=r,this.trigger="hover",this._triggerDisposables=[],i.addClass(t.nativeElement,"sim-tooltip-trigger"),this.simTooltipShowDelay=r.showDelay,this.simTooltipHideDelay=r.hideDelay,this.position=r.position||"top",this.simTooltipWidth=r.width}get message(){return this._message}set message(t){this._message=t instanceof o.L?t:(t||"").trim(),!this._message&&this._isTooltipVisible()?this.hide(0):(this._registerTriggers(),this._updateTooltipMessage())}get position(){return this._position}set position(t){t!==this._position&&(this._position=t,this._overlayRef&&(this._updatePosition(),this._tooltipInstance&&this._tooltipInstance.show(0),this._overlayRef.updatePosition()))}get disabled(){return this._disabled}set disabled(t){this._disabled=Object(l.c)(t),this._disabled?this.hide(0):this._registerTriggers()}get simTooltipPanelClass(){return this._simTooltipPanelClass}set simTooltipPanelClass(t){this._simTooltipPanelClass!==t&&this._setTooltipComponentInput("panelClass",this.simTooltipPanelClass)}_isTooltipVisible(){return!!this._tooltipInstance&&this._tooltipInstance.isVisible()}hide(t=this.simTooltipHideDelay){this._tooltipInstance&&this._tooltipInstance.hide(t)}ngAfterViewInit(){this._viewInitialized=!0,this._registerTriggers()}ngOnDestroy(){super.ngOnDestroy(),this._removeTriggerListeners(),this._overlayRef&&(this._overlayRef.dispose(),this._tooltipInstance=null)}show(t=this.simTooltipShowDelay){!this.disabled&&this.message&&(this._tooltipInstance||(this._createComponent(),this._setPositionClass()),this._updateTooltipMessage(),this._setTooltipComponentInput("panelClass",this.simTooltipPanelClass),this._setTooltipComponentInput("maxWidth",this.simTooltipWidth),this._setTooltipComponentInput("trigger",this.trigger),this._tooltipInstance.show(t))}toggle(){this._isTooltipVisible()?this.show():this.hide()}_createComponent(){const t=this._createOverlay();this._portal=this._portal||new a.d(b.a,this._viewContainerRef),this._tooltipInstance=t.attach(this._portal).instance,this._tooltipInstance.afterHidden().pipe(Object(h.untilUnmounted)(this)).subscribe(()=>this._detach()),this._tooltipInstance.hoverToggle().pipe(Object(h.untilUnmounted)(this)).subscribe(t=>{this._delayEnterLeave(!1,t)})}_createOverlay(){if(this._overlayRef)return this._overlayRef;const t=this._overlay.position().flexibleConnectedTo(this._elementRef).withTransformOriginOn(".sim-tooltip").withFlexibleDimensions(!1).withViewportMargin(8),e=this._scrollDispatcher.getAncestorScrollContainers(this._elementRef);return t.withScrollableContainers(e),t.positionChanges.pipe(Object(h.untilUnmounted)(this)).subscribe(t=>{this._tooltipInstance&&t.scrollableViewProperties.isOverlayClipped&&this._tooltipInstance.isVisible()&&this._ngZone.run(()=>this.hide(0))}),this._overlayRef=this._overlay.create({hasBackdrop:"click"===this.trigger,positionStrategy:t,panelClass:"sim-tooltip-panel",backdropClass:"",disposeOnNavigation:!0,scrollStrategy:this._overlay.scrollStrategies.reposition({scrollThrottle:20})}),this._updatePosition(),this._overlayRef.backdropClick().pipe(Object(h.untilUnmounted)(this)).subscribe(()=>this.hide(0)),this._overlayRef}_detach(){this._overlayRef&&this._overlayRef.hasAttached()&&this._overlayRef.detach(),this._tooltipInstance=null}_getOriginAndOverlayPosition(){const t=p.a[this.position];if(!t)throw Error(`Tooltip position "${t}" is invalid.`);const e={originX:t.originX,originY:t.originY},i={overlayX:t.overlayX,overlayY:t.overlayY},{x:s,y:o}=this._invertPosition(e.originX,e.originY),{x:n,y:r}=this._invertPosition(i.overlayX,i.overlayY);return{origin:{main:e,fallback:{originX:s,originY:o}},overlay:{main:i,fallback:{overlayX:n,overlayY:r}}}}_updatePosition(){const t=this._overlayRef.getConfig().positionStrategy,{origin:e,overlay:i}=this._getOriginAndOverlayPosition();t.withPositions([Object.assign(Object.assign({},e.main),i.main),Object.assign(Object.assign({},e.fallback),i.fallback)]),this._setPositionClass()}_invertPosition(t,e){return/^(top|bottom)/.test(this.position)?e=v[e]:t=y[t],{x:t,y:e}}_setTooltipComponentInput(t,e){this._tooltipInstance&&(this._tooltipInstance.setInput(t,e),this._tooltipInstance._markForCheck())}_setPositionClass(){this._setTooltipComponentInput("positionClass","sim-tooltip-content-"+this.position.replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase())}_updateTooltipMessage(){this._tooltipInstance&&(this._tooltipInstance.message=this.message,this._tooltipInstance._markForCheck(),this._ngZone.onMicrotaskEmpty.asObservable().pipe(Object(g.a)(1),Object(u.a)(this.simUnsubscribe$)).subscribe(()=>{this._tooltipInstance&&this._overlayRef.updatePosition()}))}_delayEnterLeave(t,e,i=0){this._delayTimer?(clearTimeout(this._delayTimer),this._delayTimer=null):i>0?this._delayTimer=setTimeout(()=>{this._delayTimer=null,e?this.show():this.hide()},i):e&&t?this.show():this.hide()}_registerTriggers(){if(this._disabled||!this.message||!this._viewInitialized||this._triggerDisposables.length)return;const t=this._elementRef.nativeElement;this._removeTriggerListeners();const e=new Map;switch(this.trigger){case"hover":e.set("mouseenter",()=>this._delayEnterLeave(!0,!0,150)),e.set("mouseleave",()=>this._delayEnterLeave(!0,!1,100));break;case"click":e.set("click",t=>{t.preventDefault(),this.show()});break;case"focus":e.set("focus",()=>this.show()),e.set("blur",()=>this.hide());break;default:throw Error(this.trigger+" are not supported, default triggers have [hover | click | focus]")}e.forEach((e,i)=>{this._triggerDisposables.push(this._renderer.listen(t,i,e))}),e.clear()}_removeTriggerListeners(){this._triggerDisposables.forEach(t=>{t()}),this._triggerDisposables.length=0}}return t.\u0275fac=function(e){return new(e||t)(o.Jb(o.l),o.Jb(d.d),o.Jb(o.E),o.Jb(o.z),o.Jb(o.P),o.Jb(m.e),o.Jb(_))},t.\u0275dir=o.Eb({type:t,selectors:[["","simTooltip",""]],hostVars:2,hostBindings:function(t,e){2&t&&o.Bb("sim-tooltip-trigger-disabled",e.disabled)},inputs:{message:["simTooltip","message"],position:["simTooltipPosition","position"],disabled:["simTooltipDisabled","disabled"],simTooltipHideDelay:"simTooltipHideDelay",simTooltipWidth:"simTooltipWidth",simTooltipPanelClass:"simTooltipPanelClass",simTooltipShowDelay:"simTooltipShowDelay",trigger:["simTooltipTrigger","trigger"]},exportAs:["simTooltip"],features:[o.wb]}),Object(r.a)([Object(c.b)(),Object(r.b)("design:type",Number)],t.prototype,"simTooltipHideDelay",void 0),Object(r.a)([Object(c.b)(),Object(r.b)("design:type",Number)],t.prototype,"simTooltipShowDelay",void 0),t})();var O=i("1Ztl"),C=i("2kYt"),T=i("PDqj"),x=i("LnUD"),j=i("HHFY"),I=i("voBm"),L=i("6Oco"),k=i("QQZH"),S=i("JHA6"),P=i("i7Dj"),E=i("4e/d"),Y=i("YtkY"),H=i("vobO");let D=(()=>{class t{constructor(t){this._http=t}getCodeFromUrl(t){return this.fetchFile(t)}fetchFile(t){if(!this._http)throw Error("Could not find HttpClient provider for use with Angular Simple UI icons. Please include the HttpClientModule from @angular/common/http in your app imports.");return function(t){return/(\/|\/([\w#!:.?+=&%@!\-\/]))/.test(t)}(t)||function(t){return/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(t)}(t)?this._http.get(t,{responseType:"text"}).pipe(function(t,e,i,s){const o=new k.a(1,void 0,void 0);return t=>Object(S.a)(()=>o,void 0)(t)}(),Object(P.a)(),Object(E.a)(t=>(console.error("[SimHighlight]: Unable to fetch the URL!",t.message),L.a))):L.a}}return t.\u0275fac=function(e){return new(e||t)(o.Sb(H.b))},t.\u0275prov=o.Fb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})(),M=(()=>{class t{constructor(t){this._loader=t}transform(t){return this._loader.getCodeFromUrl(t).pipe(Object(Y.a)(t=>t&&""+t.trim()))}}return t.\u0275fac=function(e){return new(e||t)(o.Jb(D))},t.\u0275pipe=o.Ib({name:"codeFromUrl",type:t,pure:!0}),t})();function X(t,e){if(1&t){const t=o.Pb();o.Ob(0,"div",11),o.Ob(1,"button",12),o.Vb("cdkCopyToClipboardCopied",(function(e){return o.lc(t),o.Yb(2).copied(e)})),o.Kb(2,"sim-icon",13),o.Nb(),o.Ob(3,"pre"),o.xc(4,"          "),o.Kb(5,"code",14),o.xc(6,"\n        "),o.Nb(),o.Nb()}if(2&t){const t=e.ngIf;o.zb(1),o.ec("cdkCopyToClipboard",t),o.zb(4),o.ec("simHighlight",t)}}function R(t,e){if(1&t){const t=o.Pb();o.Ob(0,"div",11),o.Ob(1,"button",12),o.Vb("cdkCopyToClipboardCopied",(function(e){return o.lc(t),o.Yb(2).copied(e)})),o.Kb(2,"sim-icon",13),o.Nb(),o.Ob(3,"pre"),o.xc(4,"          "),o.Kb(5,"code",15),o.xc(6,"\n        "),o.Nb(),o.Nb()}if(2&t){const t=e.ngIf;o.zb(1),o.ec("cdkCopyToClipboard",t),o.zb(4),o.ec("simHighlight",t)}}function V(t,e){if(1&t){const t=o.Pb();o.Ob(0,"div",11),o.Ob(1,"button",12),o.Vb("cdkCopyToClipboardCopied",(function(e){return o.lc(t),o.Yb(2).copied(e)})),o.Kb(2,"sim-icon",13),o.Nb(),o.Ob(3,"pre"),o.xc(4,"          "),o.Kb(5,"code",16),o.xc(6,"\n        "),o.Nb(),o.Nb()}if(2&t){const t=e.ngIf;o.zb(1),o.ec("cdkCopyToClipboard",t),o.zb(4),o.ec("simHighlight",t)}}function N(t,e){if(1&t&&(o.Ob(0,"div",6),o.Ob(1,"sim-tabset"),o.Ob(2,"sim-tab",7),o.vc(3,X,7,2,"div",8),o.Zb(4,"async"),o.Zb(5,"codeFromUrl"),o.Zb(6,"exampleUrl"),o.Nb(),o.Ob(7,"sim-tab",9),o.vc(8,R,7,2,"div",8),o.Zb(9,"async"),o.Zb(10,"codeFromUrl"),o.Zb(11,"exampleUrl"),o.Nb(),o.Ob(12,"sim-tab",10),o.vc(13,V,7,2,"div",8),o.Zb(14,"async"),o.Zb(15,"codeFromUrl"),o.Zb(16,"exampleUrl"),o.Nb(),o.Nb(),o.Nb()),2&t){const t=o.Yb();o.zb(3),o.ec("ngIf",o.ac(4,3,o.ac(5,5,o.bc(6,7,t.path,"html")))),o.zb(5),o.ec("ngIf",o.ac(9,10,o.ac(10,12,o.bc(11,14,t.path,"ts")))),o.zb(5),o.ec("ngIf",o.ac(14,17,o.ac(15,19,o.bc(16,21,t.path,"css"))))}}const U=[[["doc-example-viewer-label"]],"*"],z=["doc-example-viewer-label","*"];let F=(()=>{class t{constructor(){this.sources=[]}ngOnInit(){}copied(t){}toggleSourceShow(){this.isSourceShow=!this.isSourceShow}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=o.Db({type:t,selectors:[["doc-example-viewer"]],inputs:{path:"path"},ngContentSelectors:z,decls:8,vars:3,consts:[[1,"example-viewer-title"],[1,"example-viewer-title-spacer"],["sim-icon-button","",3,"simTooltip","click"],[3,"svgIcon"],["class","example-viewer-source",4,"ngIf"],[1,"example-viewer-body"],[1,"example-viewer-source"],["label","HTML"],["class","example-source-wrapper",4,"ngIf"],["label","TS"],["label","CSS"],[1,"example-source-wrapper"],["sim-icon-button","","simTooltip","\u590d\u5236\u4ee3\u7801",3,"cdkCopyToClipboard","cdkCopyToClipboardCopied"],["svgIcon","copy"],["languages","xml",3,"simHighlight"],["languages","ts",3,"simHighlight"],["languages","css",3,"simHighlight"]],template:function(t,e){1&t&&(o.dc(U),o.Ob(0,"div",0),o.Ob(1,"div",1),o.cc(2),o.Nb(),o.Ob(3,"button",2),o.Vb("click",(function(){return e.toggleSourceShow()})),o.Kb(4,"sim-icon",3),o.Nb(),o.Nb(),o.vc(5,N,17,24,"div",4),o.Ob(6,"div",5),o.cc(7,1),o.Nb()),2&t&&(o.zb(3),o.ec("simTooltip",e.isSourceShow?"\u5c55\u5f00":"\u6536\u8d77"),o.zb(1),o.ec("svgIcon",e.isSourceShow?"code-expand":"code-collapsed"),o.zb(1),o.ec("ngIf",e.isSourceShow))},directives:function(){return[n.b,w,O.a,C.t,T.a,x.b,j.a,I.a]},pipes:function(){return[C.b,M,A]},styles:["[_nghost-%COMP%]{display:block;margin:4px;border:1px solid rgba(0,0,0,.03);box-shadow:0 2px 2px rgba(0,0,0,.24),0 0 2px rgba(0,0,0,.12)}.example-viewer-title[_ngcontent-%COMP%]{display:flex;align-content:center;align-items:center;justify-content:center;padding:8px 20px;color:rgba(0,0,0,.54);background:rgba(0,0,0,.03)}.example-viewer-body[_ngcontent-%COMP%]{padding:30px}.example-viewer-title-spacer[_ngcontent-%COMP%]{flex:1 1 auto}.example-source-wrapper[_ngcontent-%COMP%]   .sim-icon-button[_ngcontent-%COMP%]{position:absolute;top:8px;right:8px;display:none}.example-source-wrapper[_ngcontent-%COMP%]:hover   .sim-icon-button[_ngcontent-%COMP%]{display:inline-block}.example-source-wrapper[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]{min-height:150px;margin:0;padding:0 30px 0 0;overflow:hidden;border-bottom:1px solid rgba(0,0,0,.12)}.example-source-wrapper[_ngcontent-%COMP%]   pre[_ngcontent-%COMP%]   code[_ngcontent-%COMP%]{background:none;border:none}"]}),t})(),J=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275dir=o.Eb({type:t,selectors:[["","docExampleViewerLabel",""],["doc-example-viewer-label"]]}),t})(),A=(()=>{class t{transform(t,e){if(t)return s.a.host+`/assets/examples/${t}.${e}`}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275pipe=o.Ib({name:"exampleUrl",type:t,pure:!0}),t})()},WLkT:function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var s=i("HYj3");const o={top:new s.c({originX:"center",originY:"top"},{overlayX:"center",overlayY:"bottom"}),topStart:new s.c({originX:"start",originY:"top"},{overlayX:"start",overlayY:"bottom"}),topEnd:new s.c({originX:"end",originY:"top"},{overlayX:"end",overlayY:"bottom"}),right:new s.c({originX:"end",originY:"center"},{overlayX:"start",overlayY:"center"}),rightStart:new s.c({originX:"end",originY:"top"},{overlayX:"start",overlayY:"top"}),rightEnd:new s.c({originX:"end",originY:"bottom"},{overlayX:"start",overlayY:"bottom"}),bottom:new s.c({originX:"center",originY:"bottom"},{overlayX:"center",overlayY:"top"}),bottomStart:new s.c({originX:"start",originY:"bottom"},{overlayX:"start",overlayY:"top"}),bottomEnd:new s.c({originX:"end",originY:"bottom"},{overlayX:"end",overlayY:"top"}),left:new s.c({originX:"start",originY:"center"},{overlayX:"end",overlayY:"center"}),leftStart:new s.c({originX:"start",originY:"top"},{overlayX:"end",overlayY:"top"}),leftEnd:new s.c({originX:"start",originY:"bottom"},{overlayX:"end",overlayY:"bottom"})}},ca7O:function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));var s=i("EM62");const o=["*"];let n=(()=>{class t{constructor(t,e){const{nativeElement:i}=t;e.addClass(i,"doc-viewer"),e.addClass(i,"sim-typography")}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)(s.Jb(s.l),s.Jb(s.E))},t.\u0275cmp=s.Db({type:t,selectors:[["doc-viewer"]],ngContentSelectors:o,decls:1,vars:0,template:function(t,e){1&t&&(s.dc(),s.cc(0))},styles:[""],encapsulation:2}),t})()},voBm:function(t,e,i){"use strict";i.d(e,"a",(function(){return C}));var s=i("EM62"),o=i("Bhpx"),n=i("VvXq"),r=i("nbm+"),a=i("e4iD"),l=i("YtkY"),h=i("8j5Y"),c=i("2kYt"),p=i("C05f"),g=i("6Oco"),u=i("47ST"),b=i("wTjk"),d=i("GoAz"),m=i("xVbo"),_=i("J+dc"),f=i("TLy2"),y=i("4e/d");let v=(()=>{class t{constructor(t,e,i){this._options=i,this._ready=new p.a(null),this.ready=this._ready.asObservable().pipe(Object(m.a)(t=>!!t),Object(_.a)(1)),Object(c.I)(e)&&t.defaultView.hljs?this._ready.next(t.defaultView.hljs):this._loadLibrary().pipe(Object(f.a)(t=>(this._ready.next(t),g.a)),Object(y.a)(t=>(console.error("[SimHighlightLoader] ",t),g.a))).subscribe()}_loadLibrary(){if(this._options){if(this._options.fullLibraryLoader&&this._options.coreLibraryLoader)return Object(u.a)("The full library and the core library were imported, only one of them should be imported!");if(this._options.fullLibraryLoader&&this._options.languages)return Object(u.a)("The highlighting languages were imported they are not needed!");if(this._options.coreLibraryLoader&&!this._options.languages)return Object(u.a)("The highlighting languages were not imported!");if(!this._options.coreLibraryLoader&&this._options.languages)return Object(u.a)("The core library was not imported!");if(this._options.fullLibraryLoader)return this.loadFullLibrary();if(this._options.coreLibraryLoader&&this._options.languages&&Object.keys(this._options.languages).length)return this.loadCoreLibrary().pipe(Object(f.a)(t=>this._loadLanguages(t)))}return Object(u.a)("Highlight.js library was not imported!")}_loadLanguages(t){const e=Object.entries(this._options.languages).map(([e,i])=>w(i()).pipe(Object(h.a)(i=>t.registerLanguage(e,i))));return Object(b.a)(...e).pipe(Object(l.a)(()=>t))}loadCoreLibrary(){return w(this._options.coreLibraryLoader())}loadFullLibrary(){return w(this._options.fullLibraryLoader())}}return t.\u0275fac=function(e){return new(e||t)(s.Sb(c.e),s.Sb(s.B),s.Sb(r.a,8))},t.\u0275prov=s.Fb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();const w=t=>Object(d.a)(t).pipe(Object(m.a)(t=>!!t&&!!t.default),Object(l.a)(t=>t.default));let O=(()=>{class t{constructor(t,e){this._loader=t,this._options=e,t.ready.pipe().subscribe(t=>{this._hljs=t,e&&e.config&&(t.configure(e.config),t.listLanguages().length<1&&console.error("[HighlightJS]: No languages were registered!"))})}get hljs(){return this._hljs}highlight(t,e,i,s){return this._loader.ready.pipe(Object(l.a)(o=>o.highlight(t,e,i,s)))}highlightBlock(t){return this._loader.ready.pipe(Object(l.a)(e=>e.highlightBlock(t)))}highlightAuto(t,e){return this._loader.ready.pipe(Object(l.a)(i=>i.highlightAuto(t,e)))}fixMarkup(t){return this._loader.ready.pipe(Object(l.a)(e=>e.fixMarkup(t)))}configure(t){return this._loader.ready.pipe(Object(l.a)(e=>e.configure(t)))}initHighlighting(){return this._loader.ready.pipe(Object(l.a)(t=>t.initHighlighting()))}registerLanguage(t,e){return this._loader.ready.pipe(Object(h.a)(i=>i.registerLanguage(t,e)))}listLanguages(){return this._loader.ready.pipe(Object(l.a)(t=>t.listLanguages()))}getLanguage(t){return this._loader.ready.pipe(Object(l.a)(e=>e.getLanguage(t)))}}return t.\u0275fac=function(e){return new(e||t)(s.Sb(v),s.Sb(r.a,8))},t.\u0275prov=s.Fb({token:t,factory:t.\u0275fac,providedIn:"root"}),t})(),C=(()=>{class t{constructor(t,e,i,s,o){this.elementRef=t,this.renderer=e,this._sanitizer=i,this._highlight=s,this._options=o,this._languages=[],this._nativeElement=this.elementRef.nativeElement,this.renderer.addClass(this._nativeElement,"hljs"),this.renderer.addClass(this._nativeElement,"sim-highlight-code");const n=this.renderer.parentNode(this._nativeElement);n&&"pre"===n.nodeName.toLowerCase()&&(this._preElement=n,this.renderer.addClass(this._preElement,"sim-highlight-pre"))}get languages(){return this._languages}set languages(t){Object(o.a)(t)?this._languages=t:Object(o.l)(t)&&(this._languages=[t])}ngOnChanges(t){const{simHighlight:e}=t;e&&void 0!==e.currentValue&&e.currentValue&&e.currentValue!==e.previousValue&&this.highlightElement(this.simHighlight,this.languages)}ngAfterViewInit(){this.simHighlight&&this.simHighlight.trim()||(this._nativeElement.innerHTML=this._nativeElement.innerHTML.trim(),console.log(),this._highlight.highlightBlock(this._nativeElement).subscribe(()=>{this.setPreClass(this.languages)}))}highlightElement(t,e){this.setTextContent(t),this._highlight.highlightAuto(t,e).subscribe(t=>{this.setInnerHTML(t.value),this.setPreClass(e)})}setTextContent(t){n.a.schedule(()=>this._nativeElement.textContent=t)}setInnerHTML(t){n.a.schedule(()=>this._nativeElement.innerHTML=this._sanitizer.sanitize(s.I.HTML,t))}setPreClass(t){this._preElement&&t.forEach(t=>{this.renderer.addClass(this._preElement,"language-"+t)})}}return t.\u0275fac=function(e){return new(e||t)(s.Jb(s.l),s.Jb(s.E),s.Jb(a.b),s.Jb(O),s.Jb(r.a,8))},t.\u0275dir=s.Eb({type:t,selectors:[["","simHighlight",""]],inputs:{simHighlight:"simHighlight",languages:"languages"},features:[s.xb]}),t})()},wTjk:function(t,e,i){"use strict";i.d(e,"a",(function(){return h}));var s=i("ckkg"),o=i("FU6l"),n=i("5uGe"),r=i("pBDD"),a=i("mW0F"),l=i("sWLk");function h(...t){const e=t[t.length-1];return"function"==typeof e&&t.pop(),Object(s.a)(t,void 0).lift(new c(e))}class c{constructor(t){this.resultSelector=t}call(t,e){return e.subscribe(new p(t,this.resultSelector))}}class p extends n.a{constructor(t,e,i=Object.create(null)){super(t),this.iterators=[],this.active=0,this.resultSelector="function"==typeof e?e:null,this.values=i}_next(t){const e=this.iterators;Object(o.a)(t)?e.push(new u(t)):e.push("function"==typeof t[l.a]?new g(t[l.a]()):new b(this.destination,this,t))}_complete(){const t=this.iterators,e=t.length;if(this.unsubscribe(),0!==e){this.active=e;for(let i=0;i<e;i++){let e=t[i];e.stillUnsubscribed?this.destination.add(e.subscribe(e,i)):this.active--}}else this.destination.complete()}notifyInactive(){this.active--,0===this.active&&this.destination.complete()}checkIterators(){const t=this.iterators,e=t.length,i=this.destination;for(let n=0;n<e;n++){let e=t[n];if("function"==typeof e.hasValue&&!e.hasValue())return}let s=!1;const o=[];for(let n=0;n<e;n++){let e=t[n],r=e.next();if(e.hasCompleted()&&(s=!0),r.done)return void i.complete();o.push(r.value)}this.resultSelector?this._tryresultSelector(o):i.next(o),s&&i.complete()}_tryresultSelector(t){let e;try{e=this.resultSelector.apply(this,t)}catch(i){return void this.destination.error(i)}this.destination.next(e)}}class g{constructor(t){this.iterator=t,this.nextResult=t.next()}hasValue(){return!0}next(){const t=this.nextResult;return this.nextResult=this.iterator.next(),t}hasCompleted(){const t=this.nextResult;return t&&t.done}}class u{constructor(t){this.array=t,this.index=0,this.length=0,this.length=t.length}[l.a](){return this}next(t){const e=this.index++;return e<this.length?{value:this.array[e],done:!1}:{value:null,done:!0}}hasValue(){return this.array.length>this.index}hasCompleted(){return this.array.length===this.index}}class b extends r.a{constructor(t,e,i){super(t),this.parent=e,this.observable=i,this.stillUnsubscribed=!0,this.buffer=[],this.isComplete=!1}[l.a](){return this}next(){const t=this.buffer;return 0===t.length&&this.isComplete?{value:null,done:!0}:{value:t.shift(),done:!1}}hasValue(){return this.buffer.length>0}hasCompleted(){return 0===this.buffer.length&&this.isComplete}notifyComplete(){this.buffer.length>0?(this.isComplete=!0,this.parent.notifyInactive()):this.destination.complete()}notifyNext(t,e,i,s,o){this.buffer.push(e),this.parent.checkIterators()}subscribe(t,e){return Object(a.a)(this,this.observable,this,e)}}}}]);