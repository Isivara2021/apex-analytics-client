import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeeklyPlanService, WeeklyPlan, PlanDay, PlanExercise } from '../../services/weekly-plan.service';
import { ExerciseService, Exercise } from '../../services/exercise.service';

@Component({
  selector: 'app-weekly-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weekly-planner.component.html',
  styleUrl: './weekly-planner.component.css'
})
export class WeeklyPlannerComponent implements OnInit {
  plans: WeeklyPlan[] = [];
  loading = true;
  showCreateForm = false;
  submitting = false;
  deletingId: number | null = null;
  expandedPlan: number | null = null;
  error = '';
  success = '';

  // Form state
  planName = '';
  allExercises: Exercise[] = [];
  days: PlanDay[] = [];

  readonly DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  readonly QUICK_TEMPLATES = [
    {
      name: 'Push Pull Legs',
      days: [
        { day: 'Monday', label: 'Push Day' },
        { day: 'Tuesday', label: 'Pull Day' },
        { day: 'Wednesday', label: 'Leg Day' },
        { day: 'Thursday', label: 'Rest' },
        { day: 'Friday', label: 'Push Day' },
        { day: 'Saturday', label: 'Pull Day' },
        { day: 'Sunday', label: 'Rest' }
      ]
    },
    {
      name: 'Upper Lower Split',
      days: [
        { day: 'Monday', label: 'Upper Body' },
        { day: 'Tuesday', label: 'Lower Body' },
        { day: 'Wednesday', label: 'Rest' },
        { day: 'Thursday', label: 'Upper Body' },
        { day: 'Friday', label: 'Lower Body' },
        { day: 'Saturday', label: 'Rest' },
        { day: 'Sunday', label: 'Rest' }
      ]
    },
    {
      name: 'Bro Split',
      days: [
        { day: 'Monday', label: 'Chest Day' },
        { day: 'Tuesday', label: 'Back Day' },
        { day: 'Wednesday', label: 'Shoulder Day' },
        { day: 'Thursday', label: 'Leg Day' },
        { day: 'Friday', label: 'Arms Day' },
        { day: 'Saturday', label: 'Rest' },
        { day: 'Sunday', label: 'Rest' }
      ]
    }
  ];

  // Exercise picker state per day
  showPickerForDay: number | null = null;
  pickerSearch = '';
  pickerFiltered: Exercise[] = [];

  constructor(
    private weeklyPlanService: WeeklyPlanService,
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPlans();
    this.loadExercises();
    this.initEmptyDays();
  }

  loadPlans(): void {
    this.loading = true;
    this.weeklyPlanService.getPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadExercises(): void {
    this.exerciseService.getExercises().subscribe({
      next: (data) => {
        this.allExercises = data;
        this.pickerFiltered = data;
      }
    });
  }

  initEmptyDays(): void {
    this.days = this.DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day,
      label: day === 'Saturday' || day === 'Sunday' ? 'Rest' : '',
      exercises: []
    }));
  }

  applyTemplate(template: typeof this.QUICK_TEMPLATES[0]): void {
    this.planName = template.name;
    this.days = this.DAYS_OF_WEEK.map(day => {
      const t = template.days.find(d => d.day === day);
      return {
        dayOfWeek: day,
        label: t?.label || '',
        exercises: []
      };
    });
    this.cdr.detectChanges();
  }

  // Exercise picker per day
  openPickerForDay(dayIndex: number): void {
    this.showPickerForDay = this.showPickerForDay === dayIndex ? null : dayIndex;
    this.pickerSearch = '';
    this.pickerFiltered = this.allExercises;
  }

  searchPicker(): void {
    const q = this.pickerSearch.toLowerCase();
    this.pickerFiltered = this.allExercises.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.category.name.toLowerCase().includes(q)
    );
  }

  addExerciseToDay(dayIndex: number, exercise: Exercise): void {
    const day = this.days[dayIndex];
    if (day.exercises.some(e => e.exerciseId === exercise.id)) return;
    day.exercises.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: 3,
      targetReps: 10
    });
    this.showPickerForDay = null;
    this.cdr.detectChanges();
  }

  removeExerciseFromDay(dayIndex: number, exIndex: number): void {
    this.days[dayIndex].exercises.splice(exIndex, 1);
  }

  isRestDay(day: PlanDay): boolean {
    return day.label.toLowerCase() === 'rest' || day.exercises.length === 0;
  }

  submitPlan(): void {
    if (!this.planName.trim()) {
      this.error = 'Please enter a plan name.';
      return;
    }
    this.submitting = true;
    this.error = '';

    const payload = {
      name: this.planName,
      days: this.days.map(d => ({
        dayOfWeek: d.dayOfWeek,
        label: d.label || 'Rest',
        exercises: d.exercises.map(e => ({
          exerciseId: e.exerciseId,
          targetSets: Number(e.targetSets),
          targetReps: Number(e.targetReps)
        }))
      }))
    };

    this.weeklyPlanService.createPlan(payload).subscribe({
      next: () => {
        this.success = 'Plan created successfully!';
        this.submitting = false;
        this.showCreateForm = false;
        this.planName = '';
        this.initEmptyDays();
        this.loadPlans();
        setTimeout(() => { this.success = ''; this.cdr.detectChanges(); }, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to create plan.';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletePlan(id: number): void {
    if (!confirm('Delete this plan?')) return;
    this.deletingId = id;
    this.weeklyPlanService.deletePlan(id).subscribe({
      next: () => {
        this.plans = this.plans.filter(p => p.id !== id);
        this.deletingId = null;
        this.cdr.detectChanges();
      },
      error: () => {
        this.deletingId = null;
        this.cdr.detectChanges();
      }
    });
  }

  togglePlan(id: number): void {
    this.expandedPlan = this.expandedPlan === id ? null : id;
  }

  getDayIcon(label: string): string {
    const l = label.toLowerCase();
    if (l.includes('push') || l.includes('chest')) return 'ti-barbell';
    if (l.includes('pull') || l.includes('back')) return 'ti-arrow-back-up';
    if (l.includes('leg')) return 'ti-run';
    if (l.includes('shoulder')) return 'ti-arrows-up-left';
    if (l.includes('arm')) return 'ti-hand-grab';
    if (l.includes('upper')) return 'ti-arrow-up';
    if (l.includes('lower')) return 'ti-arrow-down';
    if (l.includes('rest')) return 'ti-zzz';
    return 'ti-barbell';
  }

  getTotalExercises(plan: WeeklyPlan): number {
    return plan.days.reduce((sum, d) => sum + d.exercises.length, 0);
  }

  getTrainingDays(plan: WeeklyPlan): number {
    return plan.days.filter(d => d.exercises.length > 0).length;
  }
}