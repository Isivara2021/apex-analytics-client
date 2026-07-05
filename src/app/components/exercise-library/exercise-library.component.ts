import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExerciseService, Exercise, ExerciseCategory } from '../../services/exercise.service';

@Component({
  selector: 'app-exercise-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exercise-library.component.html',
  styleUrl: './exercise-library.component.css'
})
export class ExerciseLibraryComponent implements OnInit {
  exercises: Exercise[] = [];
  categories: ExerciseCategory[] = [];
  loading = true;
  searchQuery = '';
  selectedCategory = '';
  selectedDifficulty = '';
  selectedExercise: Exercise | null = null;
  searchTimeout: any;

  constructor(
    private exerciseService: ExerciseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadExercises();
  }

  loadCategories(): void {
    this.exerciseService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cdr.detectChanges();
      }
    });
  }

  loadExercises(): void {
    this.loading = true;
    this.exerciseService.getExercises(
      this.selectedCategory || undefined,
      this.selectedDifficulty || undefined,
      this.searchQuery || undefined
    ).subscribe({
      next: (data) => {
        this.exercises = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.loadExercises(), 400);
  }

  selectCategory(cat: string): void {
    this.selectedCategory = this.selectedCategory === cat ? '' : cat;
    this.loadExercises();
  }

  selectDifficulty(diff: string): void {
    this.selectedDifficulty = this.selectedDifficulty === diff ? '' : diff;
    this.loadExercises();
  }

  openExercise(exercise: Exercise): void {
    this.selectedExercise = exercise;
    document.body.style.overflow = 'hidden';
  }

  closeExercise(): void {
    this.selectedExercise = null;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
  }

  getInstructions(text: string): string[] {
    return text.split('|').filter(s => s.trim());
  }

  getDifficultyClass(difficulty: string): string {
    const map: Record<string, string> = {
      'Beginner': 'badge-green',
      'Intermediate': 'badge-orange',
      'Advanced': 'badge-red'
    };
    return map[difficulty] || 'badge-gray';
  }

  getCategoryIcon(name: string): string {
    const icons: Record<string, string> = {
      'Chest': 'ti-barbell',
      'Back': 'ti-arrow-back-up',
      'Legs': 'ti-run',
      'Shoulders': 'ti-arrows-up-left',
      'Arms': 'ti-hand-grab',
      'Core': 'ti-circles-relation'
    };
    return icons[name] || 'ti-dumbbell';
  }

  getEquipmentIcon(equipment: string): string {
    if (equipment.toLowerCase().includes('barbell')) return 'ti-barbell';
    if (equipment.toLowerCase().includes('dumbbell')) return 'ti-barbell';
    if (equipment.toLowerCase().includes('cable')) return 'ti-line-dashed';
    if (equipment.toLowerCase().includes('bodyweight')) return 'ti-man';
    if (equipment.toLowerCase().includes('machine')) return 'ti-settings';
    return 'ti-barbell';
  }

  get filteredCount(): number {
    return this.exercises.length;
  }
}