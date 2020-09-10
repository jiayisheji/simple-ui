import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimAlertComponent } from './alert.component';

describe('SimAlertComponent', () => {
  let component: SimAlertComponent;
  let fixture: ComponentFixture<SimAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimAlertComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
