import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FitnessProfileService, FitnessProfile, UserProfile } from '../../services/fitness-profile.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  fitnessProfile: FitnessProfile | null = null;

  loadingUser = true;
  loadingFitness = true;
  savingFitness = false;
  savingUser = false;

  successFitness = '';
  successUser = '';
  errorFitness = '';
  errorUser = '';

  // User form
  username = '';
  email = '';

  // Fitness form
  age = 0;
  gender = '';
  height = 0;
  weight = 0;
  trainingExperience = '';
  goal = '';

  readonly GOALS = [
    { value: 'muscle_gain', label: 'Muscle Gain', icon: 'ti-barbell' },
    { value: 'fat_loss', label: 'Fat Loss', icon: 'ti-flame' },
    { value: 'strength', label: 'Strength', icon: 'ti-bolt' },
    { value: 'maintenance', label: 'Maintenance', icon: 'ti-heart' }
  ];

  readonly EXPERIENCE_LEVELS = [
    { value: 'beginner', label: 'Beginner', desc: 'Less than 1 year' },
    { value: 'intermediate', label: 'Intermediate', desc: '1–3 years' },
    { value: 'advanced', label: 'Advanced', desc: '3+ years' }
  ];

  constructor(
    private fitnessProfileService: FitnessProfileService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadFitnessProfile();
  }

  loadUserProfile(): void {
    this.fitnessProfileService.getUserProfile().subscribe({
      next: (data) => {
        this.userProfile = data;
        this.username = data.username;
        this.email = data.email;
        this.loadingUser = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingUser = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFitnessProfile(): void {
    this.fitnessProfileService.getFitnessProfile().subscribe({
      next: (data) => {
        this.fitnessProfile = data;
        this.age = data.age;
        this.gender = data.gender;
        this.height = data.height;
        this.weight = data.weight;
        this.trainingExperience = data.trainingExperience;
        this.goal = data.goal;
        this.loadingFitness = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingFitness = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveFitnessProfile(): void {
    if (!this.age || !this.gender || !this.height || !this.weight || !this.trainingExperience || !this.goal) {
      this.errorFitness = 'Please fill in all fields.';
      return;
    }
    this.savingFitness = true;
    this.errorFitness = '';

    this.fitnessProfileService.saveFitnessProfile({
      age: Number(this.age),
      gender: this.gender,
      height: Number(this.height),
      weight: Number(this.weight),
      trainingExperience: this.trainingExperience,
      goal: this.goal
    }).subscribe({
      next: (data) => {
        this.fitnessProfile = data;
        this.savingFitness = false;
        this.successFitness = 'Fitness profile saved!';
        setTimeout(() => { this.successFitness = ''; this.cdr.detectChanges(); }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorFitness = 'Failed to save. Please try again.';
        this.savingFitness = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveUserProfile(): void {
    if (!this.username || !this.email) {
      this.errorUser = 'Please fill in all fields.';
      return;
    }
    this.savingUser = true;
    this.errorUser = '';

    this.fitnessProfileService.updateUser({
      username: this.username,
      email: this.email
    }).subscribe({
      next: (data) => {
        this.userProfile = data;
        this.savingUser = false;
        this.successUser = 'Account updated!';
        localStorage.setItem('username', data.username);
        setTimeout(() => { this.successUser = ''; this.cdr.detectChanges(); }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorUser = 'Failed to update. Please try again.';
        this.savingUser = false;
        this.cdr.detectChanges();
      }
    });
  }

  getBmiCategory(bmi: number): { label: string; class: string } {
    if (bmi < 18.5) return { label: 'Underweight', class: 'badge-blue' };
    if (bmi < 25) return { label: 'Normal weight', class: 'badge-green' };
    if (bmi < 30) return { label: 'Overweight', class: 'badge-orange' };
    return { label: 'Obese', class: 'badge-red' };
  }

  getGoalLabel(value: string): string {
    return this.GOALS.find(g => g.value === value)?.label || value;
  }

  getExperienceLabel(value: string): string {
    return this.EXPERIENCE_LEVELS.find(e => e.value === value)?.label || value;
  }

  logout(): void {
    this.authService.logout();
  }
}