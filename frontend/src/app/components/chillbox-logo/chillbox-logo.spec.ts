import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChillboxLogo } from './chillbox-logo';

describe('ChillboxLogo', () => {
  let component: ChillboxLogo;
  let fixture: ComponentFixture<ChillboxLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChillboxLogo],
    }).compileComponents();

    fixture = TestBed.createComponent(ChillboxLogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
