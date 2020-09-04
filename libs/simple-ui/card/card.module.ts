import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimSkeletonModule } from '@ngx-simple/simple-ui/skeleton';
import {
  SimCardActionsDirective,
  SimCardAvatarDirective,
  SimCardComponent,
  SimCardContentComponent,
  SimCardExtraDirective,
  SimCardFooterDirective,
  SimCardHeaderComponent,
  SimCardImageDirective,
  SimCardRevealButtonDirective,
  SimCardRevealComponent,
  SimCardSubtitleDirective,
  SimCardTitleDirective,
  SimCardTitleGroupComponent
} from './card.component';

@NgModule({
  declarations: [
    SimCardComponent,
    SimCardTitleDirective,
    SimCardHeaderComponent,
    SimCardSubtitleDirective,
    SimCardRevealComponent,
    SimCardTitleGroupComponent,
    SimCardContentComponent,
    SimCardRevealButtonDirective,
    SimCardImageDirective,
    SimCardExtraDirective,
    SimCardAvatarDirective,
    SimCardActionsDirective,
    SimCardFooterDirective
  ],
  imports: [CommonModule, SimSkeletonModule],
  exports: [
    SimCardComponent,
    SimCardTitleDirective,
    SimCardHeaderComponent,
    SimCardSubtitleDirective,
    SimCardRevealButtonDirective,
    SimCardRevealComponent,
    SimCardTitleGroupComponent,
    SimCardImageDirective,
    SimCardExtraDirective,
    SimCardAvatarDirective,
    SimCardActionsDirective,
    SimCardFooterDirective,
    SimCardContentComponent
  ]
})
export class SimCardModule {}
