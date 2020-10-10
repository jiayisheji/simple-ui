import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimCheckboxComponent } from './checkbox.component';

describe('SimCheckboxComponent', () => {
  let component: SimCheckboxComponent;
  let fixture: ComponentFixture<SimCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimCheckboxComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
