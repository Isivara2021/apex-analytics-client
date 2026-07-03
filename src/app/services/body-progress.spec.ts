import { TestBed } from '@angular/core/testing';

import { BodyProgress } from './body-progress';

describe('BodyProgress', () => {
  let service: BodyProgress;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BodyProgress);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
