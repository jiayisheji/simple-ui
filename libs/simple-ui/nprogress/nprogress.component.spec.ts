import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NprogressComponent } from './nprogress.component';

describe('NprogressComponent', () => {
  let component: NprogressComponent;
  let fixture: ComponentFixture<NprogressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NprogressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
