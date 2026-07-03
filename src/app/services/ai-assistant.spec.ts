import { TestBed } from '@angular/core/testing';

import { AiAssistant } from './ai-assistant';

describe('AiAssistant', () => {
  let service: AiAssistant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiAssistant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
