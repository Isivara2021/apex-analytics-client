import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FitnessProfile {
  id: number;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  trainingExperience: string;
  goal: string;
}

export interface UpdateUserDto {
  username: string;
  email: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class FitnessProfileService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  getFitnessProfile(): Observable<FitnessProfile> {
    return this.http.get<FitnessProfile>(`${this.apiUrl}/fitnessprofile`);
  }

  saveFitnessProfile(dto: Omit<FitnessProfile, 'id' | 'bmi'>): Observable<FitnessProfile> {
    return this.http.put<FitnessProfile>(`${this.apiUrl}/fitnessprofile`, dto);
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/profile`);
  }

  updateUser(dto: UpdateUserDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/user/update`, dto);
  }
}