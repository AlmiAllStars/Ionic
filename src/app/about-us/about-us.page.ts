import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  valores = [
    { title: 'Innovación', description: 'Nos reinventamos constantemente', icon: 'bulb-outline' },
    { title: 'Calidad', description: 'Ofrecemos el mejor servicio', icon: 'shield-checkmark-outline' },
    { title: 'Atención al Cliente', description: 'Siempre cerca de ti', icon: 'people-outline' },
    { title: 'Sostenibilidad', description: 'Comprometidos con el medio ambiente', icon: 'leaf-outline' }
  ];

  equipo = [
    { name: 'Maria Garcia', role: 'CEO', photo: '../../assets/images/team1.webp' },
    { name: 'Juan Pérez', role: 'CTO', photo: '../../assets/images/team2.webp' },
    { name: 'Ana Martínez', role: 'CMO', photo: '../../assets/images/team3.webp' },
    { name: 'Carlos Lopez', role: 'COO', photo: '../../assets/images/team4.webp' }
  ];

  constructor() {}

  ngOnInit() {}
}
