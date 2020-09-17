import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimEmptyComponent } from './empty.component';

describe('SimEmptyComponent', () => {
  let component: SimEmptyComponent;
  let fixture: ComponentFixture<SimEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimEmptyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
