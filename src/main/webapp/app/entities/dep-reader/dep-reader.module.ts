import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepReaderRoutingModule } from './dep-reader-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeTableModule } from 'primeng/treetable';
import { DepReaderMainComponent } from './dep-reader-main.component';

@NgModule({
  declarations: [DepReaderMainComponent],
  imports: [
    SharedModule,
    CommonModule,
    DepReaderRoutingModule,
    TreeModule,
    TreeSelectModule,
    TreeTableModule,
  ]
})
export class DepReaderModule { }
