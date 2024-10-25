import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReparacionesPage } from './reparaciones.page';

describe('ReparacionesPage', () => {
  let component: ReparacionesPage;
  let fixture: ComponentFixture<ReparacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReparacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
