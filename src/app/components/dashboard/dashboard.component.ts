import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnalyticsService, DashboardSummary, AiInsight } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardSummary | null = null;
  aiInsight: AiInsight | null = null;
  loadingDashboard = true;
  loadingAi = false;
  error = '';

  constructor(
    private analyticsService: AnalyticsService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loadingDashboard = true;
    this.error = '';

    this.analyticsService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = this.normalizeDashboard(data);
        this.loadingDashboard = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.dashboard = this.getEmptyDashboard();
        this.error =
          err.name === 'TimeoutError'
            ? 'Dashboard is taking too long to load. Showing an empty overview for now.'
            : 'Failed to load dashboard. Showing an empty overview for now.';
        this.loadingDashboard = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadAiInsight(): void {
    this.loadingAi = true;

    this.analyticsService.getAiInsight().subscribe({
      next: (data) => {
        this.aiInsight = data;
        this.loadingAi = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingAi = false;
        this.cdr.detectChanges();
      }
    });
  }

  getGreeting(): string {
    const h = new Date().getHours();

    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';

    return 'evening';
  }

  formatVolume(vol: number): string {
    if (vol >= 1000) {
      return (vol / 1000).toFixed(1) + 'k';
    }

    return vol.toString();
  }

  getVolumePercent(volume: number): number {
    if (!this.dashboard || this.dashboard.muscleGroupBreakdown.length === 0) {
      return 0;
    }

    const max = Math.max(
      ...this.dashboard.muscleGroupBreakdown.map((m) => m.totalVolume)
    );

    return max > 0 ? (volume / max) * 100 : 0;
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Chest: 'ti-barbell',
      Back: 'ti-arrow-back-up',
      Legs: 'ti-run',
      Shoulders: 'ti-arrows-up-left',
      Arms: 'ti-hand-grab',
      Core: 'ti-circles-relation'
    };

    return icons[category] || 'ti-dumbbell';
  }

  getBmiCategory(bmi: number): { label: string; class: string } {
    if (bmi < 18.5) {
      return { label: 'Underweight', class: 'badge-blue' };
    }

    if (bmi < 25) {
      return { label: 'Normal', class: 'badge-green' };
    }

    if (bmi < 30) {
      return { label: 'Overweight', class: 'badge-orange' };
    }

    return { label: 'Obese', class: 'badge-red' };
  }

  private normalizeDashboard(
    data: DashboardSummary | null | undefined
  ): DashboardSummary {
    const fallback = this.getEmptyDashboard();

    return {
      totalWorkouts: data?.totalWorkouts ?? fallback.totalWorkouts,
      trainingStreakDays:
        data?.trainingStreakDays ?? fallback.trainingStreakDays,
      totalVolumeAllTime:
        data?.totalVolumeAllTime ?? fallback.totalVolumeAllTime,
      currentWeight: data?.currentWeight ?? fallback.currentWeight,
      currentBMI: data?.currentBMI ?? fallback.currentBMI,
      topPersonalRecords: Array.isArray(data?.topPersonalRecords)
        ? data.topPersonalRecords
        : [],
      muscleGroupBreakdown: Array.isArray(data?.muscleGroupBreakdown)
        ? data.muscleGroupBreakdown
        : []
    };
  }

  private getEmptyDashboard(): DashboardSummary {
    return {
      totalWorkouts: 0,
      trainingStreakDays: 0,
      totalVolumeAllTime: 0,
      currentWeight: null,
      currentBMI: null,
      topPersonalRecords: [],
      muscleGroupBreakdown: []
    };
  }
}