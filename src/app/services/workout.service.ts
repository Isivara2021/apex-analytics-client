import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ExerciseSet {
  id?: number;
  setNumber: number;
  weight: number;
  reps: number;
  restSeconds: number;
}

export interface WorkoutExerciseEntry {
  exerciseId: number;
  exerciseName?: string;
  sets: ExerciseSet[];
}

export interface CreateWorkoutSession {
  date: string;
  workoutType: string;
  notes: string;
  durationMinutes: number;
  exercises: WorkoutExerciseEntry[];
}

export interface WorkoutSession {
  id: number;
  date: string;
  workoutType: string;
  notes: string;
  durationMinutes: number;
  exercises: {
    id: number;
    exerciseId: number;
    exerciseName: string;
    sets: ExerciseSet[];
    totalVolume: number;
  }[];
  totalVolume: number;
}

@Injectable({ providedIn: 'root' })
export class WorkoutService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  createSession(dto: CreateWorkoutSession): Observable<WorkoutSession> {
    return this.http.post<WorkoutSession>(`${this.apiUrl}/workout/session`, dto);
  }

  getHistory(): Observable<WorkoutSession[]> {
    return this.http.get<WorkoutSession[]>(`${this.apiUrl}/workout/history`);
  }

  getSession(id: number): Observable<WorkoutSession> {
    return this.http.get<WorkoutSession>(`${this.apiUrl}/workout/session/${id}`);
  }

  deleteSession(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/workout/session/${id}`);
  }
}