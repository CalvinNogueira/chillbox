import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetsPostForm } from './snippets-post-form';

describe('SnippetsPostForm', () => {
  let component: SnippetsPostForm;
  let fixture: ComponentFixture<SnippetsPostForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetsPostForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetsPostForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
