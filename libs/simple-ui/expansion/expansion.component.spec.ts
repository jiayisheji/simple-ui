import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimExpansionComponent } from './expansion.component';

describe('SimExpansionComponent', () => {
  let component: SimExpansionComponent;
  let fixture: ComponentFixture<SimExpansionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimExpansionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
