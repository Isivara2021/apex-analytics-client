import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';
  success = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    // show success message after register
    const registered = this.route.snapshot.queryParamMap.get('registered');
    if (registered === 'true') {
      this.success = 'Account created successfully. Please sign in.';
    }
  }

  onSubmit(): void {
    if (this.loading) return; // prevents double clicks

    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        console.log('LOGIN SUCCESS', res);

        this.loading = false;

        this.router.navigate(['/dashboard']).catch(() => {
          this.error = 'Navigation failed. Please try again.';
        });
      },

      error: (err) => {
        console.log('LOGIN ERROR', err);

        this.loading = false;
        this.error = this.getLoginError(err);
      },

      complete: () => {
        console.log('LOGIN REQUEST COMPLETE');
      }
    });
  }

  private getLoginError(err: any): string {
    if (err?.name === 'TimeoutError') {
      return 'Login is taking too long. Please try again.';
    }

    if (err?.status === 401) {
      return 'Invalid email or password. Please try again.';
    }

    if (err?.status === 0) {
      return 'Cannot connect to server. Please check your internet.';
    }

    if (typeof err?.error === 'string' && err.error.trim()) {
      return err.error;
    }

    return 'Login failed. Please try again.';
  }
}