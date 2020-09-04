import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimSkeletonComponent } from './skeleton.component';

describe('SimSkeletonComponent', () => {
  let component: SimSkeletonComponent;
  let fixture: ComponentFixture<SimSkeletonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimSkeletonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
