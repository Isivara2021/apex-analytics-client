import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyPlanner } from './weekly-planner';

describe('WeeklyPlanner', () => {
  let component: WeeklyPlanner;
  let fixture: ComponentFixture<WeeklyPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyPlanner],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyPlanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
