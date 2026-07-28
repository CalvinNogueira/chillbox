import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetModifyButton } from './snippet-modify-button';

describe('SnippetModifyButton', () => {
  let component: SnippetModifyButton;
  let fixture: ComponentFixture<SnippetModifyButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetModifyButton],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetModifyButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
