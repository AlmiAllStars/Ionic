import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TramitarPage } from './tramitar.page';

describe('TramitarPage', () => {
  let component: TramitarPage;
  let fixture: ComponentFixture<TramitarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
