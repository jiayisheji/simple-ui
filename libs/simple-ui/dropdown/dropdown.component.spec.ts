import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimDropdownComponent } from './dropdown.component';

describe('SimDropdownComponent', () => {
  let component: SimDropdownComponent;
  let fixture: ComponentFixture<SimDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimDropdownComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
