import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimSortComponent } from './sort.component';

describe('SimSortComponent', () => {
  let component: SimSortComponent;
  let fixture: ComponentFixture<SimSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimSortComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
