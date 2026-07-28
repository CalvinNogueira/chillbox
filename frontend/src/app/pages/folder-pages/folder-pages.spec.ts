import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderPages } from './folder-pages';

describe('FolderPages', () => {
  let component: FolderPages;
  let fixture: ComponentFixture<FolderPages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderPages],
    }).compileComponents();

    fixture = TestBed.createComponent(FolderPages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
