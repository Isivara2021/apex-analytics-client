import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogWorkout } from './log-workout';

describe('LogWorkout', () => {
  let component: LogWorkout;
  let fixture: ComponentFixture<LogWorkout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogWorkout],
    }).compileComponents();

    fixture = TestBed.createComponent(LogWorkout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
