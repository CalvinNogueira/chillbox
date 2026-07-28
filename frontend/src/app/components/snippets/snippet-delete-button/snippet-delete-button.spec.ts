import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetDeleteButton } from './snippet-delete-button';

describe('SnippetDeleteButton', () => {
  let component: SnippetDeleteButton;
  let fixture: ComponentFixture<SnippetDeleteButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetDeleteButton],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetDeleteButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
