import { Component, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <app-navbar *ngIf="authService.isLoggedIn()"></app-navbar>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, private renderer: Renderer2) {}

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.renderer.setAttribute(document.documentElement, 'data-theme', savedTheme);
  }
}