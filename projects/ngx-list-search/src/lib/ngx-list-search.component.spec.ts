import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxListSearchComponent } from './ngx-list-search.component';

describe('NgxListSearchComponent', () => {
  let component: NgxListSearchComponent;
  let fixture: ComponentFixture<NgxListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxListSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
