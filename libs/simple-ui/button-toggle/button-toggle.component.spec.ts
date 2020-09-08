import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimButtonToggleComponent } from './button-toggle.component';

describe('ButtonToggleComponent', () => {
  let component: SimButtonToggleComponent<any>;
  let fixture: ComponentFixture<SimButtonToggleComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimButtonToggleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimButtonToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
