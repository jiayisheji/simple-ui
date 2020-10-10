import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimToastComponent } from './toast.component';

describe('SimToastComponent', () => {
  let component: SimToastComponent;
  let fixture: ComponentFixture<SimToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimToastComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
