import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationLink } from './navigation-link';

describe('NavigationLink', () => {
  let component: NavigationLink;
  let fixture: ComponentFixture<NavigationLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationLink],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationLink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
