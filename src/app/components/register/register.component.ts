import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  error = '';
  success = '';

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.success = '';
    this.authService.register({
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created successfully. Redirecting to login...';
        this.username = '';
        this.email = '';
        this.password = '';

        setTimeout(() => {
          this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
        }, 1200);
      },
      error: (err) => {
        this.error = err.name === 'TimeoutError'
          ? 'Registration is taking too long. Please try again.'
          : err.error || 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
