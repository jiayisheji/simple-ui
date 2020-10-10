(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{nY1i:function(e,i,t){"use strict";t.r(i),t.d(i,"RadioModule",(function(){return G}));var s=t("sEIs"),o=t("M0ag"),r=t("2kYt"),n=t("EM62");let a=(()=>{class e{}return e.\u0275mod=n.Hb({type:e}),e.\u0275inj=n.Gb({factory:function(i){return new(i||e)},imports:[[r.c]]}),e})();var c=t("aiL/"),d=t("ikI+"),l=t("nIj0"),h=t("sg/T"),u=t("cqs0");const b=["input"],m=["*"],p=new n.q("sim-radio-default-options",{providedIn:"root",factory:function(){return{color:"primary"}}});class _{constructor(e,i){this.source=e,this.value=i}}let f=0,g=0,v=(()=>{class e{constructor(e,i){this.ngControl=e,this._changeDetector=i,this._name="sim-radio-group-"+g++,this.change=new n.n,this._isInitialized=!1,this._controlValueAccessorChangeFn=()=>{},this._onTouched=()=>{},this.ngControl&&(this.ngControl.valueAccessor=this)}get name(){return this._name}set name(e){this._name=e,this._updateRadioButtonNames()}get labelPosition(){return this._labelPosition}set labelPosition(e){this._labelPosition="before"===e?"before":"after",this._markRadiosForCheck()}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,this._updateSelectedRadioFromValue(),this._checkSelectedRadioButton())}get selected(){return this._selected}set selected(e){this._selected=e,this.value=e?e.value:null,this._checkSelectedRadioButton()}get disabled(){return this.ngControl?!!this.ngControl.disabled:this._disabled}set disabled(e){this._disabled=Object(d.b)(e),this._markRadiosForCheck()}get required(){return this._required}set required(e){this._required=Object(d.b)(e),this._markRadiosForCheck()}ngAfterContentInit(){this._isInitialized=!0}writeValue(e){this.value=e,this._changeDetector.markForCheck()}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetector.markForCheck()}_checkSelectedRadioButton(){this._selected&&!this._selected.checked&&(this._selected.checked=!0)}_touch(){this._onTouched&&this._onTouched()}_emitChangeEvent(){this._isInitialized&&this.change.emit(new _(this._selected,this._value))}_markRadiosForCheck(){this._radios&&this._radios.forEach(e=>e._markForCheck())}_updateSelectedRadioFromValue(){this._radios&&(null==this._selected||this._selected.value!==this._value)&&(this._selected=null,this._radios.forEach(e=>{e.checked=this.value===e.value,e.checked&&(this._selected=e)}))}_updateRadioButtonNames(){this._radios&&this._radios.forEach(e=>{e.name=this.name,e._markForCheck()})}}return e.\u0275fac=function(i){return new(i||e)(n.Jb(l.j,10),n.Jb(n.h))},e.\u0275dir=n.Eb({type:e,selectors:[["sim-radio-group"]],contentQueries:function(e,i,t){var s;1&e&&n.Cb(t,k,!0),2&e&&n.kc(s=n.Xb())&&(i._radios=s)},hostAttrs:["role","radiogroup",1,"sim-radio-group"],hostVars:1,hostBindings:function(e,i){2&e&&n.Ab("id",i.id||i.name)},inputs:{name:"name",labelPosition:"labelPosition",value:"value",selected:"selected",disabled:"disabled",required:"required",color:"color"},outputs:{change:"change"},exportAs:["simRadioGroup"]}),e})(),k=(()=>{class e{constructor(e,i,t,s,o,r){this._elementRef=i,this._changeDetectorRef=t,this._focusMonitor=s,this._radioDispatcher=o,this._providerOverride=r,this._color="primary",this._tabIndex=0,this._labelPosition="after",this.change=new n.n,this._uniqueId="sim-radio-"+ ++f,this._removeUniqueSelectionListener=()=>{},this.radioGroup=e,this._removeUniqueSelectionListener=o.listen((e,i)=>{e!==this.id&&i===this.name&&(this.checked=!1)})}get color(){return this._color||this.radioGroup&&this.radioGroup.color||this._providerOverride&&this._providerOverride.color||"primary"}set color(e){this._color=e}get checked(){return this._checked}set checked(e){const i=Object(d.b)(e);this._checked!==i&&(this._checked=i,this.radioGroup&&(i&&this.radioGroup.value!==this.value?this.radioGroup.selected=this:i||this.radioGroup.value!==this.value||(this.radioGroup.selected=null)),i&&this._radioDispatcher.notify(this.id,this.name),this._markForCheck())}get disabled(){return this._disabled||this.radioGroup&&this.radioGroup.disabled}set disabled(e){this._setDisabled(Object(d.b)(e))}get tabIndex(){return this.disabled?-1:this._tabIndex}set tabIndex(e){this._tabIndex=null!=e?e:0}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,null!==this.radioGroup&&(this.checked||(this.checked=this.radioGroup.value===e),this.checked&&(this.radioGroup.selected=this)))}get labelPosition(){return this._labelPosition||this.radioGroup&&this.radioGroup.labelPosition||"after"}set labelPosition(e){this._labelPosition=e}get required(){return this._required||this.radioGroup&&this.radioGroup.required}set required(e){this._required=Object(d.b)(e)}get inputId(){return(this.id||this._uniqueId)+"-input"}ngOnInit(){this.id=this.id||this._uniqueId,this.radioGroup&&(this.checked=this.radioGroup.value===this._value,this.name=this.radioGroup.name)}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{!e&&this.radioGroup&&this.radioGroup._touch()})}ngOnDestroy(){this._focusMonitor.stopMonitoring(this._elementRef),this._removeUniqueSelectionListener()}_focus(){this._inputElement.nativeElement.focus()}focus(e){this._focusMonitor.focusVia(this._inputElement,"keyboard",e)}_markForCheck(){this._changeDetectorRef.markForCheck()}_onInputChange(e){if(e.stopPropagation(),this.checked=!0,this._emitChangeEvent(),this.radioGroup){const e=this.value!==this.radioGroup.value;this.radioGroup._controlValueAccessorChangeFn(this.value),e&&this.radioGroup._emitChangeEvent()}}_onInputClick(e){e.stopPropagation()}_setDisabled(e){this._disabled!==e&&(this._disabled=e,this._markForCheck())}_emitChangeEvent(){this.change.emit(new _(this,this._value))}}return e.\u0275fac=function(i){return new(i||e)(n.Jb(v),n.Jb(n.l),n.Jb(n.h),n.Jb(h.c),n.Jb(u.c),n.Jb(p,8))},e.\u0275cmp=n.Db({type:e,selectors:[["sim-radio"]],viewQuery:function(e,i){var t;1&e&&n.Ec(b,!0),2&e&&n.kc(t=n.Xb())&&(i._inputElement=t.first)},hostAttrs:["role","radio",1,"sim-radio"],hostVars:18,hostBindings:function(e,i){1&e&&n.Wb("focus",(function(){return i._focus()})),2&e&&(n.Ab("tabindex",null)("id",i.id),n.Bb("sim-primary","primary"===i.color)("sim-secondary","secondary"===i.color)("sim-success","success"===i.color)("sim-info","info"===i.color)("sim-warning","warning"===i.color)("sim-danger","danger"===i.color)("sim-radio-checked",i.checked)("sim-radio-disabled",i.disabled))},inputs:{color:"color",checked:"checked",disabled:"disabled",tabIndex:"tabIndex",value:"value",labelPosition:"labelPosition",required:"required",data:"data",id:"id",name:"name"},outputs:{change:"change"},ngContentSelectors:m,decls:10,vars:12,consts:[[1,"sim-radio-label"],[1,"sim-radio-container"],[1,"sim-radio-outer-circle"],[1,"sim-radio-inner-circle"],["type","radio",1,"sim-radio-input","cdk-visually-hidden",3,"id","checked","disabled","tabIndex","required","change","click"],["input",""],[1,"sim-radio-label-content"]],template:function(e,i){1&e&&(n.fc(),n.Pb(0,"label",0),n.Pb(1,"div",1),n.Kb(2,"div",2),n.Kb(3,"div",3),n.Pb(4,"input",4,5),n.Wb("change",(function(e){return i._onInputChange(e)}))("click",(function(e){return i._onInputClick(e)})),n.Ob(),n.Ob(),n.Pb(6,"div",6),n.Pb(7,"span"),n.Ac(8,"\xa0"),n.Ob(),n.ec(9),n.Ob(),n.Ob()),2&e&&(n.Ab("for",i.inputId),n.zb(4),n.gc("id",i.inputId)("checked",i.checked)("disabled",i.disabled)("tabIndex",i.tabIndex)("required",i.required),n.Ab("name",i.name)("value",i.value),n.zb(2),n.Bb("sim-radio-label-before","before"==i.labelPosition),n.zb(1),n.vc("display","none"))},styles:['.sim-radio{display:inline-block;-webkit-tap-highlight-color:transparent;outline:0}.sim-radio-group .sim-radio{margin-right:8px}.sim-radio-label{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:inline-flex;align-items:center;white-space:nowrap;vertical-align:middle;cursor:pointer}.sim-radio-label-content{display:inline-block;order:0;padding-right:0;padding-left:8px;line-height:inherit}.sim-radio-label-content.sim-radio-label-before{order:-1;padding-right:8px;padding-left:0}.sim-radio-container{position:relative;display:inline-block;flex-shrink:0;box-sizing:border-box}.sim-radio-checked .sim-radio-container:after{position:absolute;top:0;left:0;z-index:10;box-sizing:border-box;width:100%;height:100%;border-width:1px;border-style:solid;border-radius:50%;visibility:hidden;-webkit-animation:simRadioEffect .36s ease-in-out both;animation:simRadioEffect .36s ease-in-out both;content:""}.sim-radio:hover .sim-radio-container:after{visibility:visible}.sim-radio-inner-circle,.sim-radio-outer-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%}.sim-radio-outer-circle{transition:border-color .28s ease;border-width:1px;border-style:solid;border-radius:50%}.sim-radio-inner-circle{border-radius:50%;transform:scale(.001);transition:transform .28s ease,background-color .28s ease}.sim-radio-checked .sim-radio-inner-circle{transform:scale(.5)}.sim-radio-disabled,.sim-radio-disabled .sim-radio-label{cursor:default}.sim-radio-input{bottom:0;left:50%}@-webkit-keyframes simRadioEffect{0%{transform:scale(1);opacity:.5}to{transform:scale(1.6);opacity:0}}@keyframes simRadioEffect{0%{transform:scale(1);opacity:.5}to{transform:scale(1.6);opacity:0}}'],encapsulation:2,changeDetection:0}),e})(),y=(()=>{class e{}return e.\u0275mod=n.Hb({type:e}),e.\u0275inj=n.Gb({factory:function(i){return new(i||e)},imports:[[r.c]]}),e})();var w=t("PBVc");let I=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=n.Db({type:e,selectors:[["ng-component"]],decls:7,vars:0,template:function(e,i){1&e&&(n.Pb(0,"doc-playground-components"),n.Pb(1,"h1"),n.Ac(2," Radio "),n.Pb(3,"span"),n.Ac(4,"\u4e2d\u6587"),n.Ob(),n.Ob(),n.Pb(5,"p"),n.Ac(6,"\u7c21\u55ae\u63cf\u8ff0"),n.Ob(),n.Ob())},directives:[w.a],styles:[""]}),e})(),P=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=n.Db({type:e,selectors:[["doc-api"]],decls:2,vars:0,template:function(e,i){1&e&&(n.Pb(0,"p"),n.Ac(1,"api works!"),n.Ob())},styles:[""]}),e})(),C=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=n.Db({type:e,selectors:[["doc-examples"]],decls:2,vars:0,template:function(e,i){1&e&&(n.Pb(0,"p"),n.Ac(1,"examples works!"),n.Ob())},styles:[""]}),e})();const O=[{path:"",component:I,children:[{path:"",redirectTo:"overview",pathMatch:"full"},{path:"overview",component:(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(i){return new(i||e)},e.\u0275cmp=n.Db({type:e,selectors:[["doc-overview"]],decls:9,vars:0,consts:[["value","left"],["value","center"],["value","right"],["value","justify","disabled",""]],template:function(e,i){1&e&&(n.Pb(0,"sim-radio-group"),n.Pb(1,"sim-radio",0),n.Ac(2," format_align_left "),n.Ob(),n.Pb(3,"sim-radio",1),n.Ac(4," format_align_center "),n.Ob(),n.Pb(5,"sim-radio",2),n.Ac(6," format_align_right "),n.Ob(),n.Pb(7,"sim-radio",3),n.Ac(8," format_align_justify "),n.Ob(),n.Ob())},directives:[v,k],styles:[""]}),e})()},{path:"api",component:P},{path:"examples",component:C}]}];let G=(()=>{class e{}return e.\u0275mod=n.Hb({type:e}),e.\u0275inj=n.Gb({factory:function(i){return new(i||e)},imports:[[s.i.forChild(O),y,o.a,c.a,a]]}),e})()}}]);