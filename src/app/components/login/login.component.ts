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
  styleUrl: './login.component.css'
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
    if (this.authService.isLoggedIn()) this.router.navigate(['/dashboard']);
    if (this.route.snapshot.queryParamMap.get('registered') === 'true') {
      this.success = 'Account created successfully. Please sign in.';
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: async () => {
        const navigated = await this.router.navigate(['/dashboard']);
        if (!navigated) {
          this.error = 'Login succeeded, but the dashboard could not be opened.';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = this.getLoginError(err);
        this.loading = false;
      }
    });
  }

  private getLoginError(err: any): string {
    if (err.name === 'TimeoutError') {
      return 'Login is taking too long. Please try again.';
    }

    if (err.status === 401) {
      return 'Invalid email or password. Please try again.';
    }

    if (typeof err.error === 'string' && err.error.trim()) {
      return err.error;
    }

    return 'Login failed. Please try again.';
  }
}
