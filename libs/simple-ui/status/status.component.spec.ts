import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimStatusComponent } from './status.component';

describe('SimStatusComponent', () => {
  let component: SimStatusComponent;
  let fixture: ComponentFixture<SimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
