import { TestBed } from '@angular/core/testing';

import { WeeklyPlan } from './weekly-plan';

describe('WeeklyPlan', () => {
  let service: WeeklyPlan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyPlan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
