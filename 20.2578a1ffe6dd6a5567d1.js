(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{vtVN:function(r,e,t){"use strict";t.r(e),t.d(e,"FormFieldModule",(function(){return k}));var n=t("sEIs"),o=t("aiL/"),s=t("2kYt"),c=t("EM62");let i=(()=>{class r{}return r.\u0275mod=c.Hb({type:r}),r.\u0275inj=c.Gb({factory:function(e){return new(e||r)},imports:[[s.c]]}),r})();var a=t("M0ag"),m=t("aLJ8"),b=t("1uAr");let u=(()=>{class r{constructor(){}ngOnInit(){}}return r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=c.Db({type:r,selectors:[["doc-api"]],decls:2,vars:0,template:function(r,e){1&r&&(c.Ob(0,"p"),c.xc(1,"api works!"),c.Nb())},styles:[""]}),r})(),l=(()=>{class r{constructor(){}ngOnInit(){}}return r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=c.Db({type:r,selectors:[["doc-examples"]],decls:2,vars:0,template:function(r,e){1&r&&(c.Ob(0,"p"),c.xc(1,"examples works!"),c.Nb())},styles:[""]}),r})();var p=t("PBVc");let f=(()=>{class r{constructor(){}ngOnInit(){}}return r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=c.Db({type:r,selectors:[["ng-component"]],decls:7,vars:0,template:function(r,e){1&r&&(c.Ob(0,"doc-playground-components"),c.Ob(1,"h1"),c.xc(2," FormField "),c.Ob(3,"span"),c.xc(4,"\u8868\u5355\u5b57\u6bb5"),c.Nb(),c.Nb(),c.Ob(5,"p"),c.xc(6,"\u5177\u6709\u6570\u636e\u6536\u96c6\u3001\u6821\u9a8c\u548c\u63d0\u4ea4\u529f\u80fd\u7684\u8868\u5355\uff0c\u5305\u542b\u590d\u9009\u6846\u3001\u5355\u9009\u6846\u3001\u8f93\u5165\u6846\u3001\u4e0b\u62c9\u9009\u62e9\u6846\u7b49\u5143\u7d20\u3002"),c.Nb(),c.Nb())},directives:[p.a],styles:[""]}),r})();var d=t("nIj0"),v=t("zhiy"),O=t("VG9p"),w=t("VKCB"),x=t("5+nm"),h=t("F0+F"),N=t("bU9t"),g=t("BeyH"),y=t("TTzw");function q(r,e){1&r&&(c.Ob(0,"sim-error"),c.xc(1,"\u6700\u5c0f\u957f\u5ea6\u662f5"),c.Nb())}function F(r,e){1&r&&(c.Ob(0,"sim-error"),c.xc(1,"\u6700\u5927\u957f\u5ea6\u662f10"),c.Nb())}function H(r,e){1&r&&(c.Ob(0,"sim-error"),c.xc(1,"\u7528\u6237\u540d\u5fc5\u586b\u7684"),c.Nb())}function I(r,e){1&r&&(c.Ob(0,"sim-error"),c.xc(1,"\u5bc6\u7801\u5fc5\u586b\u7684"),c.Nb())}const E=[{path:"",component:f,children:[{path:"",redirectTo:"overview",pathMatch:"full"},{path:"overview",component:(()=>{class r{constructor(r){this.fb=r}ngOnInit(){this.validateForm=this.fb.group({username:[null,[d.q.compose([d.q.required,d.q.minLength(5),d.q.maxLength(10)])]],password:[null,[d.q.required]]})}onSubmit(){console.log(this.validateForm.value)}}return r.\u0275fac=function(e){return new(e||r)(c.Jb(d.b))},r.\u0275cmp=c.Db({type:r,selectors:[["doc-overview"]],decls:16,vars:5,consts:[["sim-form","",3,"formGroup","ngSubmit"],["simInput","","required","","formControlName","username"],[4,"simHasError"],["type","password","simInput","","required","","formControlName","password"],["type","submit","sim-raised-button","","color","primary"]],template:function(r,e){1&r&&(c.Ob(0,"form",0),c.Vb("ngSubmit",(function(){return e.onSubmit()})),c.Ob(1,"sim-form-field"),c.Ob(2,"sim-form-label"),c.xc(3,"\u7528\u6237\u540d"),c.Nb(),c.Kb(4,"input",1),c.vc(5,q,2,0,"sim-error",2),c.vc(6,F,2,0,"sim-error",2),c.vc(7,H,2,0,"sim-error",2),c.Nb(),c.Ob(8,"sim-form-field"),c.Ob(9,"sim-form-label"),c.xc(10,"\u5bc6\u7801"),c.Nb(),c.Kb(11,"input",3),c.vc(12,I,2,0,"sim-error",2),c.Nb(),c.Ob(13,"sim-form-actions"),c.Ob(14,"button",4),c.xc(15,"\u767b\u5f55"),c.Nb(),c.Nb(),c.Nb()),2&r&&(c.ec("formGroup",e.validateForm),c.zb(5),c.ec("simHasError","minlength"),c.zb(1),c.ec("simHasError","maxlength"),c.zb(1),c.ec("simHasError","required"),c.zb(5),c.ec("simHasError","required"))},directives:[d.r,d.l,v.a,d.f,O.b,w.a,x.a,d.a,d.p,d.k,d.d,h.a,N.a,g.b,y.a],styles:[".sim-form-label[_ngcontent-%COMP%]{flex:0 0 100px;max-width:100px}.sim-form-actions[_ngcontent-%COMP%]{margin-left:100px}"]}),r})()},{path:"api",component:u},{path:"examples",component:l}]}];let k=(()=>{class r{}return r.\u0275mod=c.Hb({type:r}),r.\u0275inj=c.Gb({factory:function(e){return new(e||r)},imports:[[n.i.forChild(E),m.c,a.a,o.a,i,b.a]]}),r})()}}]);