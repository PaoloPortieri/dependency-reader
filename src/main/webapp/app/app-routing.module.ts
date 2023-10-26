import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          // Update this route to redirect to 'dep-reader'
          path: '',
          redirectTo: '/dep-reader',
          pathMatch: 'full',
        },
        {
          // Add route for 'dep-reader'
          path: 'dep-reader',
          loadChildren: () => import('./entities/dep-reader/dep-reader.module').then(m => m.DepReaderModule),
        },
        navbarRoute,
        ...errorRoute,
      ],
      // { enableTracing: DEBUG_INFO_ENABLED }
      { enableTracing: true }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
