import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */

      {
        path: 'dep-reader',
        loadChildren: () => import('./dep-reader/dep-reader.module').then(m => m.DepReaderModule),
      },
    ]),
  ],
})
export class EntityRoutingModule { }
