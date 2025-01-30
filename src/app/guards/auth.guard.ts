import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanMatchFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
