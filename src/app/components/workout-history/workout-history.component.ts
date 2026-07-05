import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService, WorkoutSession } from '../../services/workout.service';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './workout-history.component.html',
  styleUrl: './workout-history.component.css'
})
export class WorkoutHistoryComponent implements OnInit {
  sessions: WorkoutSession[] = [];
  loading = true;
  expandedSession: number | null = null;
  deletingId: number | null = null;
  error = '';

  constructor(
    private workoutService: WorkoutService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.workoutService.getHistory().subscribe({
      next: (data) => {
        this.sessions = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load workout history.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleExpand(id: number): void {
    this.expandedSession = this.expandedSession === id ? null : id;
  }

  deleteSession(id: number, event: Event): void {
    event.stopPropagation();
    if (!confirm('Delete this workout session?')) return;
    this.deletingId = id;
    this.workoutService.deleteSession(id).subscribe({
      next: () => {
        this.sessions = this.sessions.filter(s => s.id !== id);
        this.deletingId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.deletingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  getTotalSets(session: WorkoutSession): number {
    return session.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  }

  formatVolume(vol: number): string {
    if (vol >= 1000) return (vol / 1000).toFixed(1) + 'k';
    return vol.toString();
  }

  getWorkoutTypeIcon(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('chest') || t.includes('push')) return 'ti-barbell';
    if (t.includes('back') || t.includes('pull')) return 'ti-arrow-back-up';
    if (t.includes('leg')) return 'ti-run';
    if (t.includes('shoulder')) return 'ti-arrows-up-left';
    if (t.includes('arm')) return 'ti-hand-grab';
    if (t.includes('core')) return 'ti-circles-relation';
    if (t.includes('cardio')) return 'ti-heart-rate-monitor';
    return 'ti-barbell';
  }

  getWorkoutTypeColor(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('chest') || t.includes('push')) return 'blue';
    if (t.includes('back') || t.includes('pull')) return 'green';
    if (t.includes('leg')) return 'orange';
    if (t.includes('shoulder')) return 'red';
    return 'blue';
  }
}