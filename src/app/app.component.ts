import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  showNavbar = false;

  private readonly AUTH_ROUTES = ['/login', '/register'];

  constructor(
    public authService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.renderer.setAttribute(document.documentElement, 'data-theme', savedTheme);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentUrl = event.urlAfterRedirects || event.url;
      const isAuthRoute = this.AUTH_ROUTES.some(route => currentUrl.startsWith(route));
      this.showNavbar = !isAuthRoute && this.authService.isLoggedIn();
    });
  }
}