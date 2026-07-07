import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetsPostPages } from './snippets-post-pages';

describe('SnippetsPostPages', () => {
  let component: SnippetsPostPages;
  let fixture: ComponentFixture<SnippetsPostPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetsPostPages],
    }).compileComponents();

    fixture = TestBed.createComponent(SnippetsPostPages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
