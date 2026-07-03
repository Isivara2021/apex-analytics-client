import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyProgress } from './body-progress';

describe('BodyProgress', () => {
  let component: BodyProgress;
  let fixture: ComponentFixture<BodyProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(BodyProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
