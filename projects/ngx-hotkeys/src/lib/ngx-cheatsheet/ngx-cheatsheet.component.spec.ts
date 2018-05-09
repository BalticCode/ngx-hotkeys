import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCheatsheetComponent } from './ngx-cheatsheet.component';

describe('NgxCheatsheetComponent', () => {
  let component: NgxCheatsheetComponent;
  let fixture: ComponentFixture<NgxCheatsheetComponent>;

  beforeEach(async(() => {
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
