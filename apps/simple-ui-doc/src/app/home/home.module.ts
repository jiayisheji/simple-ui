import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SimButtonModule } from '@ngx-simple/simple-ui/button';
import { SimCardModule } from '@ngx-simple/simple-ui/card';
import { SimDividerModule } from '@ngx-simple/simple-ui/divider';
import { SimSkeletonModule } from '@ngx-simple/simple-ui/skeleton';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, HomeRoutingModule, SimDividerModule, SimButtonModule, SimCardModule, SimSkeletonModule]
})
export class HomeModule {}
