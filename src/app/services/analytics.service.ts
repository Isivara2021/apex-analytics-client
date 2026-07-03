import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export interface MuscleGroupStats {
  category: string;
  sessionsCount: number;
  totalVolume: number;
  trainingFrequencyPerWeek: number;
}

export interface DashboardSummary {
  totalWorkouts: number;
  trainingStreakDays: number;
  totalVolumeAllTime: number;
  currentWeight: number | null;
  currentBMI: number | null;
  topPersonalRecords: PersonalRecord[];
  muscleGroupBreakdown: MuscleGroupStats[];
}

export interface AiInsight {
  insight: string;
  generatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/analyticsdashboard`).pipe(
      timeout(15000)
    );
  }

  getAiInsight(): Observable<AiInsight> {
    return this.http.get<AiInsight>(`${this.apiUrl}/aiassistant/insight`);
  }

  getExerciseProgress(exerciseId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/analyticsdashboard/exercise/${exerciseId}`);
  }
}
