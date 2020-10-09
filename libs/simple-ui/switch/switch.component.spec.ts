import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimSwitchComponent } from './switch.component';

describe('SimSwitchComponent', () => {
  let component: SimSwitchComponent;
  let fixture: ComponentFixture<SimSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimSwitchComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
