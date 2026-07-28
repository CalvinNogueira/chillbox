import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetBox } from './snippet-box';

describe('SnippetBox', () => {
  let component: SnippetBox;
  let fixture: ComponentFixture<SnippetBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetBox],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
