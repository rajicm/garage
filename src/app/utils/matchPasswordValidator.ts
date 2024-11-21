import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswordsValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordsMismatch: true }); // Set error on confirmPassword
      return { passwordsMismatch: true }; // Set group-level error
    }

    // Clear errors if passwords match
    group.get('confirmPassword')?.setErrors(null);
    return null;
  };
}
