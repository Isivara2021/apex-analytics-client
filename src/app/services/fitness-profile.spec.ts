import { TestBed } from '@angular/core/testing';

import { FitnessProfile } from './fitness-profile';

describe('FitnessProfile', () => {
  let service: FitnessProfile;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FitnessProfile);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
