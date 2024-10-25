import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlquilerPage } from './alquiler.page';

describe('AlquilerPage', () => {
  let component: AlquilerPage;
  let fixture: ComponentFixture<AlquilerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlquilerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
