
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  // FIX: Explicitly type injected services to resolve type inference issues.
  private fb: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router: Router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  loginError = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    const { username, password } = this.loginForm.value;

    if (this.authService.login(username!, password!)) {
      this.router.navigate(['/']);
    } else {
      this.loginError.set('Invalid username or password.');
    }
  }
}
