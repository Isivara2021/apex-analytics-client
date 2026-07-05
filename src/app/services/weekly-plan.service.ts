import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PlanExercise {
  id?: number;
  exerciseId: number;
  exerciseName?: string;
  targetSets: number;
  targetReps: number;
}

export interface PlanDay {
  id?: number;
  dayOfWeek: string;
  label: string;
  exercises: PlanExercise[];
}

export interface WeeklyPlan {
  id: number;
  name: string;
  days: PlanDay[];
}

@Injectable({ providedIn: 'root' })
export class WeeklyPlanService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  getPlans(): Observable<WeeklyPlan[]> {
    return this.http.get<WeeklyPlan[]>(`${this.apiUrl}/weeklyplan`);
  }

  getPlan(id: number): Observable<WeeklyPlan> {
    return this.http.get<WeeklyPlan>(`${this.apiUrl}/weeklyplan/${id}`);
  }

  createPlan(dto: Omit<WeeklyPlan, 'id'>): Observable<WeeklyPlan> {
    return this.http.post<WeeklyPlan>(`${this.apiUrl}/weeklyplan`, dto);
  }

  deletePlan(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/weeklyplan/${id}`);
  }
}