import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkoutService, WorkoutExerciseEntry, ExerciseSet } from '../../services/workout.service';
import { ExerciseService, Exercise } from '../../services/exercise.service';

@Component({
  selector: 'app-log-workout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-workout.component.html',
  styleUrl: './log-workout.component.css'
})
export class LogWorkoutComponent implements OnInit {
  // Step tracking
  currentStep = 1;

  // Step 1 fields
  workoutType = '';
  workoutDate = new Date().toISOString().split('T')[0];
  durationMinutes = 60;
  notes = '';

  // Step 2 fields
  exercises: WorkoutExerciseEntry[] = [];
  allExercises: Exercise[] = [];
  exerciseSearch = '';
  showExercisePicker = false;
  filteredExercises: Exercise[] = [];

  // State
  loading = false;
  submitting = false;
  error = '';
  success = false;

  workoutTypes = [
    'Chest Day', 'Back Day', 'Leg Day', 'Shoulder Day',
    'Push Day', 'Pull Day', 'Full Body', 'Arms Day', 'Core Day', 'Cardio'
  ];

  constructor(
    private workoutService: WorkoutService,
    private exerciseService: ExerciseService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadExercises();
  }

  loadExercises(): void {
    this.exerciseService.getExercises().subscribe({
      next: (data) => {
        this.allExercises = data;
        this.filteredExercises = data;
        this.cdr.detectChanges();
      }
    });
  }

  // Step 1
  selectWorkoutType(type: string): void {
    this.workoutType = type;
  }

  goToStep2(): void {
    if (!this.workoutType || !this.workoutDate) {
      this.error = 'Please fill in workout type and date.';
      return;
    }
    this.error = '';
    this.currentStep = 2;
  }

  // Exercise picker
  toggleExercisePicker(): void {
    this.showExercisePicker = !this.showExercisePicker;
    this.exerciseSearch = '';
    this.filteredExercises = this.allExercises;
  }

  searchExercises(): void {
    const q = this.exerciseSearch.toLowerCase();
    this.filteredExercises = this.allExercises.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.category.name.toLowerCase().includes(q) ||
      e.primaryMuscles.toLowerCase().includes(q)
    );
  }

  addExercise(exercise: Exercise): void {
    const already = this.exercises.find(e => e.exerciseId === exercise.id);
    if (already) {
      this.showExercisePicker = false;
      return;
    }
    this.exercises.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: [{ setNumber: 1, weight: 0, reps: 10, restSeconds: 90 }]
    });
    this.showExercisePicker = false;
    this.cdr.detectChanges();
  }

  removeExercise(index: number): void {
    this.exercises.splice(index, 1);
  }

  addSet(exerciseIndex: number): void {
    const ex = this.exercises[exerciseIndex];
    const lastSet = ex.sets[ex.sets.length - 1];
    ex.sets.push({
      setNumber: ex.sets.length + 1,
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 10,
      restSeconds: lastSet?.restSeconds || 90
    });
  }

  removeSet(exerciseIndex: number, setIndex: number): void {
    const ex = this.exercises[exerciseIndex];
    if (ex.sets.length <= 1) return;
    ex.sets.splice(setIndex, 1);
    ex.sets.forEach((s, i) => s.setNumber = i + 1);
  }

  getExerciseVolume(ex: WorkoutExerciseEntry): number {
    return ex.sets.reduce((sum, s) => sum + (s.weight * s.reps), 0);
  }

  getTotalVolume(): number {
    return this.exercises.reduce((sum, ex) => sum + this.getExerciseVolume(ex), 0);
  }

  // Submit
  submitWorkout(): void {
    if (this.exercises.length === 0) {
      this.error = 'Add at least one exercise.';
      return;
    }
    this.submitting = true;
    this.error = '';

    const payload = {
      date: new Date(this.workoutDate).toISOString(),
      workoutType: this.workoutType,
      notes: this.notes,
      durationMinutes: this.durationMinutes,
      exercises: this.exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets.map(s => ({
          setNumber: s.setNumber,
          weight: Number(s.weight),
          reps: Number(s.reps),
          restSeconds: Number(s.restSeconds)
        }))
      }))
    };

    this.workoutService.createSession(payload).subscribe({
      next: () => {
        this.success = true;
        this.submitting = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/history']), 1500);
      },
      error: () => {
        this.error = 'Failed to save workout. Please try again.';
        this.submitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}