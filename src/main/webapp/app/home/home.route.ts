import { Route } from '@angular/router';

import { AppComponent } from './home.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: AppComponent,
  data: {
    pageTitle: 'Welcome, Java Hipster!',
  },
};
