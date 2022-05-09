import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxCheatsheetComponent } from './ngx-cheatsheet.component';

describe('NgxCheatsheetComponent', () => {
  let component: NgxCheatsheetComponent;
  let fixture: ComponentFixture<NgxCheatsheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxCheatsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCheatsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
