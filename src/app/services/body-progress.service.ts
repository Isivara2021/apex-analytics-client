import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BodyRecord {
  id: number;
  date: string;
  weight: number;
  bmi: number | null;
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
  shoulders?: number;
}

export interface BodyProgressSummary {
  currentWeight: number;
  currentBMI: number | null;
  weightChange: number;
  averageMonthlyChange: number;
  totalRecords: number;
  history: BodyRecord[];
}

@Injectable({ providedIn: 'root' })
export class BodyProgressService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  addRecord(dto: Omit<BodyRecord, 'id' | 'bmi'>): Observable<BodyRecord> {
    return this.http.post<BodyRecord>(`${this.apiUrl}/bodyprogress/record`, dto);
  }

  getSummary(): Observable<BodyProgressSummary> {
    return this.http.get<BodyProgressSummary>(`${this.apiUrl}/bodyprogress/summary`);
  }

  deleteRecord(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bodyprogress/record/${id}`);
  }
}