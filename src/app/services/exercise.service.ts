import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExerciseCategory {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  categoryId: number;
  name: string;
  equipment: string;
  difficulty: string;
  primaryMuscles: string;
  secondaryMuscles: string;
  description: string;
  instructions: string;
  commonMistakes: string;
  benefits: string;
  category?: ExerciseCategory;
}

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getExercises(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/exercise`);
  }

  getExerciseById(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/exercise/${id}`);
  }

  getCategories(): Observable<ExerciseCategory[]> {
    return this.http.get<ExerciseCategory[]>(`${this.apiUrl}/exercise/categories`);
  }
}