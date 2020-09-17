import { Directive, TemplateRef } from '@angular/core';

/**
 * 该指令将在SimExpansionPanelHeader组件内部使用
 */
@Directive({
  selector: 'sim-panel-title',
  host: {
    class: 'sim-panel-title'
  }
})
export class SimPanelTitleDirective {}
/**
 * 该指令将在SimExpansionPanelHeader组件内部使用
 */
@Directive({
  selector: 'sim-panel-description',
  host: {
    class: 'sim-expansion-panel-header-description'
  }
})
export class SimPanelDescriptionDirective {}

/**
 * 该指令将在SimExpansionPanel组件内部使用
 */
@Directive({
  selector: 'sim-action-row',
  host: {
    class: 'sim-expansion-panel-action-row'
  }
})
export class SimExpansionPanelActionRowDirective {}

/**
 * 该指令将在SimExpansionPanel组件内部使用
 * 扩展面板内容将在面板首次打开后延迟呈现
 */
@Directive({
  selector: 'ng-template[SimExpansionPanelContent]'
})
export class SimExpansionPanelContentDirective {
  constructor(public _template: TemplateRef<void>) {}
}
