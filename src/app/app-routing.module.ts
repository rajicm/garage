import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParkingSpacesComponent } from './parking-spaces/parking-spaces.component';

export const routes: Routes = [
  {
    path: '',
    component: ParkingSpacesComponent,
  },
  {
    path: 'garage',
    component: ParkingSpacesComponent,
  },
  {
    path: 'reservations',
    loadComponent: () => import('./reservations/reservations.component').then(m => m.ReservationsComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
