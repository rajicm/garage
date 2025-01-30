import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces.component';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'garage',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'garage',
    component: ParkingSpacesComponent,
    canMatch: [authGuard],
  },
  {
    path: 'reservations',
    loadComponent: () =>
      import('./reservations/reservations.component').then(
        (m) => m.ReservationsComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
