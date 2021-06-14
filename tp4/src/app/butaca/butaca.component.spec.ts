import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButacaComponent } from './butaca.component';

describe('ButacaComponent', () => {
  let component: ButacaComponent;
  let fixture: ComponentFixture<ButacaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButacaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButacaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
