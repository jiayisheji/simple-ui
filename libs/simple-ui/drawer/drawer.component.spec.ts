import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimDrawerComponent } from './drawer.component';

describe('SimDrawerComponent', () => {
  let component: SimDrawerComponent;
  let fixture: ComponentFixture<SimDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimDrawerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
