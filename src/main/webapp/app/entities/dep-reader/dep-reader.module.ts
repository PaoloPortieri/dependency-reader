import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepReaderRoutingModule } from './dep-reader-routing.module';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    DepReaderRoutingModule
  ]
})
export class DepReaderModule { }
