import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import ParkingSpacesService from '../services/parking-spaces.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

export const onlyLoggedInUsersGuard: CanActivateFn = () => {
  const router = inject(Router)
  const firebaseAuth = inject(AngularFireAuth);
  if (firebaseAuth.user) {
    return true;
  } else {
    alert("You don't have permission to view this page");
    router.navigate(['']);
    return false;
  }
};
