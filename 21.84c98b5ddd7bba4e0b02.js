(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{D2Ny:function(e,t,i){"use strict";i.r(t),i.d(t,"InputModule",(function(){return S}));var n=i("sEIs"),o=i("aiL/"),s=i("2kYt"),c=i("EM62");let r=(()=>{class e{}return e.\u0275mod=c.Hb({type:e}),e.\u0275inj=c.Gb({factory:function(t){return new(t||e)},imports:[[s.c]]}),e})();var a=i("M0ag"),b=i("aLJ8"),l=i("1uAr"),u=i("d/c6");let p=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c.Db({type:e,selectors:[["doc-api"]],decls:2,vars:0,template:function(e,t){1&e&&(c.Ob(0,"p"),c.xc(1,"api works!"),c.Nb())},styles:[""]}),e})();var m=i("nIj0"),f=i("VG9p"),d=i("5+nm"),h=i("dgS/"),v=i("hVRC"),O=i("jrIJ"),x=i("xTm7"),N=i("BeyH"),g=i("1Ztl");function w(e,t){if(1&e){const e=c.Pb();c.Ob(0,"button",30),c.Vb("click",(function(){return c.lc(e),c.Yb().value=""})),c.Kb(1,"sim-icon",31),c.Nb()}}let y=(()=>{class e{constructor(e){this.toast=e,this.passwordVisible=!1}ngOnInit(){}onSearch(e){e&&e.trim()?this.toast.info(e):this.toast.warning("\u8bf7\u8f93\u5165\u5185\u5bb9")}}return e.\u0275fac=function(t){return new(t||e)(c.Jb(u.SimToastService))},e.\u0275cmp=c.Db({type:e,selectors:[["doc-examples"]],decls:64,vars:5,consts:[[1,"example-form"],[1,"example-full-width"],["simInput","","placeholder","Favorite food","value","Sushi"],["simInput","","placeholder","Favorite food","disabled","","value","Sushi"],["simInput","","placeholder","Favorite food","readonly","","value","Sushi"],["simInput","","size","small","placeholder","Favorite food","value","Sushi"],["simInput","","size","medium","placeholder","Favorite food","value","Sushi"],["simInput","","size","large","placeholder","Favorite food","value","Sushi"],["simInput","","placeholder","Leave a comment"],["simInput","","sim-autosize","","readonly","","placeholder","Leave a comment"],[1,"example-form-field"],["simInput","","type","text","placeholder","Clearable input",3,"ngModel","ngModelChange"],["sim-button","","simSuffix","","sim-icon-button","","aria-label","Clear",3,"click",4,"ngIf"],["simInput","","maxlength","256","placeholder","Message"],["message",""],["align","start"],["align","end"],["simPrefix",""],["type","number","simInput","","placeholder","money"],["simSuffix",""],["simInput","","placeholder","password",3,"type"],["password",""],["sim-button","","simSuffix","","sim-icon-button","",3,"click.stop"],[3,"svgIcon"],["type","text","simInput","","placeholder","input search text"],["svgIcon","search"],["search",""],["simSuffix","","color","primary","sim-flat-button","","sim-icon-button","",3,"click.stop"],["clear",""],["simSuffix","","color","primary","sim-flat-button","",3,"click.stop"],["sim-button","","simSuffix","","sim-icon-button","","aria-label","Clear",3,"click"],["svgIcon","close"]],template:function(e,t){if(1&e){const e=c.Pb();c.xc(0,"\u57fa\u672c\u4f7f\u7528 \u4e09\u79cd\u72b6\u6001 \u65e0 disabled readonly\n"),c.Ob(1,"form",0),c.Ob(2,"sim-form-field",1),c.Kb(3,"input",2),c.Nb(),c.Ob(4,"sim-form-field",1),c.Kb(5,"input",3),c.Nb(),c.Ob(6,"sim-form-field",1),c.Kb(7,"input",4),c.Nb(),c.Nb(),c.xc(8," \u6211\u4eec\u4e3a sim-input \u8f93\u5165\u6846\u5b9a\u4e49\u4e86\u4e09\u79cd\u5c3a\u5bf8\uff08\u5927\u3001\u9ed8\u8ba4\u3001\u5c0f\uff09\uff0c\u9ad8\u5ea6\u5206\u522b\u4e3a 40px\u300132px \u548c 24px\u3002 "),c.Ob(9,"form",0),c.Ob(10,"sim-form-field",1),c.Kb(11,"input",5),c.Nb(),c.Ob(12,"sim-form-field",1),c.Kb(13,"input",6),c.Nb(),c.Ob(14,"sim-form-field",1),c.Kb(15,"input",7),c.Nb(),c.Nb(),c.Ob(16,"form",0),c.Ob(17,"sim-form-field",1),c.Kb(18,"textarea",8),c.Nb(),c.Ob(19,"sim-form-field",1),c.Kb(20,"textarea",9),c.Nb(),c.Nb(),c.Ob(21,"sim-form-field",10),c.Ob(22,"input",11),c.Vb("ngModelChange",(function(e){return t.value=e})),c.Nb(),c.vc(23,w,2,0,"button",12),c.Nb(),c.Ob(24,"form",0),c.Ob(25,"sim-form-field",1),c.Kb(26,"input",13,14),c.Ob(28,"sim-hint",15),c.Ob(29,"strong"),c.xc(30,"Don't disclose personal info"),c.Nb(),c.Nb(),c.Ob(31,"sim-hint",16),c.xc(32),c.Nb(),c.Nb(),c.Nb(),c.Ob(33,"form",0),c.Ob(34,"sim-form-field",1),c.Ob(35,"span",17),c.xc(36,"\xa0\uffe5"),c.Nb(),c.Kb(37,"input",18),c.Ob(38,"span",19),c.xc(39,"RMB\xa0"),c.Nb(),c.Nb(),c.Nb(),c.xc(40," \u5bc6\u7801\u6846 "),c.Ob(41,"form",0),c.Ob(42,"sim-form-field",1),c.Kb(43,"input",20,21),c.Ob(45,"button",22),c.Vb("click.stop",(function(){return t.passwordVisible=!t.passwordVisible})),c.Kb(46,"sim-icon",23),c.Nb(),c.Nb(),c.Nb(),c.xc(47," \u5e26\u6709\u641c\u7d22\u6309\u94ae\u7684\u8f93\u5165\u6846 "),c.Ob(48,"form",0),c.Ob(49,"sim-form-field",1),c.Kb(50,"input",24),c.Ob(51,"span",19),c.Kb(52,"sim-icon",25),c.xc(53," \xa0\xa0 "),c.Nb(),c.Nb(),c.Ob(54,"sim-form-field",1),c.Kb(55,"input",24,26),c.Ob(57,"button",27),c.Vb("click.stop",(function(){c.lc(e);const i=c.jc(56);return t.onSearch(i.value)})),c.Kb(58,"sim-icon",25),c.Nb(),c.Nb(),c.Ob(59,"sim-form-field",1),c.Kb(60,"input",24,28),c.Ob(62,"button",29),c.Vb("click.stop",(function(){return c.lc(e),c.jc(61).value=""})),c.xc(63," clear "),c.Nb(),c.Nb(),c.Nb()}if(2&e){const e=c.jc(27);c.zb(22),c.ec("ngModel",t.value),c.zb(1),c.ec("ngIf",t.value),c.zb(9),c.zc("",e.value.length," / 256"),c.zb(11),c.ec("type",t.passwordVisible?"text":"password"),c.zb(3),c.ec("svgIcon",t.passwordVisible?"eye-invisible":"eye")}},directives:[m.r,m.l,m.m,f.b,d.a,h.a,m.a,m.k,m.n,s.t,v.a,O.a,x.a,N.b,g.a],styles:[""]}),e})();var I=i("PBVc");const K=[{path:"",component:(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c.Db({type:e,selectors:[["ng-component"]],decls:13,vars:0,template:function(e,t){1&e&&(c.Ob(0,"doc-playground-components"),c.Ob(1,"h1"),c.xc(2," Input "),c.Ob(3,"span"),c.xc(4,"\u8f93\u5165\u6846"),c.Nb(),c.Nb(),c.Ob(5,"p"),c.xc(6," \u901a\u8fc7\u9f20\u6807\u6216\u952e\u76d8\u8f93\u5165\u5185\u5bb9\uff0c\u662f\u6700\u57fa\u7840\u7684\u8868\u5355\u57df\u7684\u5305\u88c5\u3002\u589e\u5f3a\u539f\u751f "),c.Ob(7,"code"),c.xc(8,"<input>"),c.Nb(),c.xc(9," \u548c "),c.Ob(10,"code"),c.xc(11,"<textarea>"),c.Nb(),c.xc(12," \u5143\u7d20\u529f\u80fd\u3002 "),c.Nb(),c.Nb())},directives:[I.a],styles:[""]}),e})(),children:[{path:"",redirectTo:"overview",pathMatch:"full"},{path:"overview",component:(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=c.Db({type:e,selectors:[["doc-overview"]],decls:2,vars:0,template:function(e,t){1&e&&(c.Ob(0,"p"),c.xc(1,"overview works!"),c.Nb())},styles:[""]}),e})()},{path:"api",component:p},{path:"examples",component:y}]}];let S=(()=>{class e{}return e.\u0275mod=c.Hb({type:e}),e.\u0275inj=c.Gb({factory:function(t){return new(t||e)},imports:[[n.i.forChild(K),l.a,a.a,o.a,r,b.c,u.SimToastModule]]}),e})()}}]);