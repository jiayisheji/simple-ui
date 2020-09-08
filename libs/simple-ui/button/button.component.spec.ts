import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimButtonComponent } from './button.component';

describe('SimButtonComponent', () => {
  let component: SimButtonComponent;
  let fixture: ComponentFixture<SimButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
