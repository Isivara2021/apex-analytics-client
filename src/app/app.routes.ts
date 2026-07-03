import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExerciseLibraryComponent } from './components/exercise-library/exercise-library.component';
import { LogWorkoutComponent } from './components/log-workout/log-workout.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';
import { BodyProgressComponent } from './components/body-progress/body-progress.component';
import { WeeklyPlannerComponent } from './components/weekly-planner/weekly-planner.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'exercises', component: ExerciseLibraryComponent, canActivate: [authGuard] },
  { path: 'log-workout', component: LogWorkoutComponent, canActivate: [authGuard] },
  { path: 'history', component: WorkoutHistoryComponent, canActivate: [authGuard] },
  { path: 'body-progress', component: BodyProgressComponent, canActivate: [authGuard] },
  { path: 'planner', component: WeeklyPlannerComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' }
];