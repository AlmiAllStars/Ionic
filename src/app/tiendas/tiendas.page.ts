import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Loader } from '@googlemaps/js-api-loader';

declare var google: any;

@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.page.html',
  styleUrls: ['./tiendas.page.scss'],
})
export class TiendasPage implements OnInit {
  userLocation: { lat: number; lng: number } | undefined;
  tiendas = [
    {
      nombre: 'Tienda Casco Viejo',
      direccion: 'Calle del Perro, 1, 48005 Bilbao, Bizkaia',
      telefono: '944123456',
      email: 'cascoviejo@juegalmi.com',
      lat: 43.256960,
      lng: -2.923441,
    },
    {
      nombre: 'Tienda Gran Vía',
      direccion: 'Gran Vía de Don Diego López de Haro, 25, 48009 Bilbao, Bizkaia',
      telefono: '944654321',
      email: 'granvia@juegalmi.com',
      lat: 43.263012,
      lng: -2.935112,
    },
    {
      nombre: 'Tienda Deusto',
      direccion: 'Calle Lehendakari Aguirre, 29, 48014 Bilbao, Bizkaia',
      telefono: '944987654',
      email: 'deusto@juegalmi.com',
      lat: 43.271610,
      lng: -2.946340,
    }
  ];
  
  map: any;
  directionsService: any;
  directionsRenderer: any;
  nearestTienda: any;
  estimatedTime: string | undefined;

  async ngOnInit() {
    const loader = new Loader({
      apiKey: 'AIzaSyC_2u80oce4klMu1UxPiNgUjK_u42gfo28',
      version: 'weekly',
      libraries: ['geometry', 'marker'],
    });

    loader.load().then(() => {
      this.loadMap();
    });
  }

  async loadMap() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    this.userLocation = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };

    const mapOptions = {
      center: this.userLocation,
      zoom: 12,
      mapId: 'eb6ac886cfd9ad30'
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Initialize DirectionsService and DirectionsRenderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({ map: this.map });

    // Marker for User Location
    new google.maps.marker.AdvancedMarkerElement({
      position: this.userLocation,
      map: this.map,
      title: 'Tu Ubicación',
      content: this.createUserMarkerIcon(),
    });

    // Marker for each tienda
    this.tiendas.forEach((tienda) => {
      const tiendaPos = new google.maps.LatLng(tienda.lat, tienda.lng);
      new google.maps.marker.AdvancedMarkerElement({
        position: tiendaPos,
        map: this.map,
        title: tienda.nombre,
      });
    });

    // Find the nearest tienda
    this.findNearestTienda();
  }

  createUserMarkerIcon() {
    const pinSvgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 56 56" fill="none">
        <rect width="56" height="56" rx="28" fill="#FF0000"></rect>
        <path d="M28 39L26.8725 37.9904C24.9292 36.226 23.325 34.7026 22.06 33.4202C20.795 32.1378 19.7867 30.9918 19.035 29.9823C18.2833 28.9727 17.7562 28.0587 17.4537 27.2401C17.1512 26.4216 17 25.5939 17 24.7572C17 23.1201 17.5546 21.7513 18.6638 20.6508C19.7729 19.5502 21.1433 19 22.775 19C23.82 19 24.7871 19.2456 25.6762 19.7367C26.5654 20.2278 27.34 20.9372 28 21.8649C28.77 20.8827 29.5858 20.1596 30.4475 19.6958C31.3092 19.2319 32.235 19 33.225 19C34.8567 19 36.2271 19.5502 37.3362 20.6508C38.4454 21.7513 39 23.1201 39 24.7572C39 25.5939 38.8488 26.4216 38.5463 27.2401C38.2438 28.0587 37.7167 28.9727 36.965 29.9823C36.2133 30.9918 35.205 32.1378 33.94 33.4202C32.675 34.7026 31.0708 36.226 29.1275 37.9904L28 39Z" fill="#FFFFFF"/>
      </svg>
    `;
    const parser = new DOMParser();
    return parser.parseFromString(pinSvgString, 'image/svg+xml').documentElement;
  }

  findNearestTienda() {
    let nearestDistance = Infinity;

    this.tiendas.forEach((tienda) => {
      const tiendaPos = new google.maps.LatLng(tienda.lat, tienda.lng);
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(this.userLocation!.lat, this.userLocation!.lng),
        tiendaPos
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        this.nearestTienda = tienda;
        this.estimatedTime = `${Math.round(distance / 1000)} minutos en coche`;
      }
    });
  }

  setRouteToNearestTienda() {
    if (!this.nearestTienda || !this.userLocation) return;

    this.directionsService.route(
      {
        origin: this.userLocation,
        destination: { lat: this.nearestTienda.lat, lng: this.nearestTienda.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(response);
        } else {
          console.error('Error fetching directions', status);
        }
      }
    );
  }

  abrirEnGoogleMaps(lat: number, lng: number) {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  }
}
