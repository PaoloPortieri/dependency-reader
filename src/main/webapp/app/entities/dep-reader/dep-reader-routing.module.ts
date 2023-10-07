import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepReaderMainComponent } from './dep-reader-main.component';

const routes: Routes = [{
  component: DepReaderMainComponent,
  path: ''
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepReaderRoutingModule { }
