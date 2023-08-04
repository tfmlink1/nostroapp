import { Component, OnInit, Input } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';
import { LoadingController } from 'ionic-angular';
/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})

export class MapComponent implements OnInit {

  @Input() isPickupRequest: boolean;
  public map: google.maps.Map;
  public popup: google.maps.InfoWindow;
  public pickMarker: google.maps.Marker;
  public pickMarkerDest: google.maps.Marker;
  public pickMarkerCar: google.maps.Marker;
  public isMapIdle: boolean;

  constructor(private geolocation: Geolocation,
    private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.map = this.createMap();
    this.getCurrentLocation().subscribe(
      location => {
        this.centerLocation(location)
      }
    )
    this.addMapEventListeners();
  }

  centerLocation(location) {
    if (location) {
      this.map.panTo(location);
    } else {
      this.getCurrentLocation().subscribe(currentLocation => {
        this.map.panTo(currentLocation)
      })
    }
  }

  getCurrentLocation(): Observable<google.maps.LatLng> {

    let loading = this.loadingCtrl.create({
      content: 'Carregando Mapa...'
    });
    loading.present();

    let options = { timeout: 1000, enableHighAccuracy: true };

    let locationObs = Observable.create(observable => {
      this.geolocation.getCurrentPosition(options)
        .then(resp => {
          let lat = resp.coords.latitude;
          let lng = resp.coords.longitude;

          let location = new google.maps.LatLng(lat, lng);
          observable.next(location);
          loading.dismiss();
        }, err => {
          console.log('Geolocation err: ', err);
          loading.dismiss();
        })
    })
    return locationObs;
  }

  addMapEventListeners() {
    // google.maps.event.addListener(this.map, 'dragstart', () => {
    //   this.isMapIdle = false;
    //   console.log("movendo")


    // })
    google.maps.event.addListener(this.map, 'idle', () => {
      this.isMapIdle = true;
      console.log("idle")
      this.addMarker()

    })
  }

  addMarker() {
    this.removeMarker();
    this.pickMarker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      animation: google.maps.Animation.BOUNCE,
      title: 'Minha localização atual',
      icon: 'img/person-icon.png'
    });

    this.showTime();
    setTimeout(() => {
      this.pickMarker.setAnimation(null);
    }, 1000)
  }

  addMarkerCar(lat, lng){
    this.pickMarkerCar = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: this.map,
      title: 'Carro',
      icon: 'img/car.png'
    });
  }

  addMarkerMoto(){
    this.pickMarkerCar = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map,
      title: 'Carro',
      icon: 'img/moto.png'
    });
  }

  showTime() {
    this.popup = new google.maps.InfoWindow({
      content: "Estou aqui"
    });
    this.popup.open(this.map, this.pickMarker);
  }

  removeMarker() {
    if (this.pickMarker) {
      this.pickMarker.setMap(null);
      this.pickMarker = null;
    }
  }

  getMotors

  createMap(location = new google.maps.LatLng(-24.2405247, -49.7047437)) {
    let mapOptions = {
      center: location,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }

    let mapEl = document.getElementById('map');
    let map = new google.maps.Map(mapEl, mapOptions);
    this.pickMarker = new google.maps.Marker({
      position: location,
      map: map,
      animation: google.maps.Animation.BOUNCE,
      title: 'Minha localização atual',
      icon: 'img/person-icon.png'
    });

    setTimeout(() => {
      this.pickMarker.setAnimation(null);
    }, 1000)
    return map;
  }

}
