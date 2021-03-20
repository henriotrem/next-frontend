import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Segment} from '../models/Segment.model';

@Injectable()
export class ConstantsService{
  readonly baseAppUrl: string = environment.apiUrl; // 'http://172.20.10.3:3000';
  readonly markerOptions = {
    stop: {
      draggable: false,
      icon: {
        url: this.baseAppUrl + '/images/marker.png',
        anchor: new google.maps.Point(10, 10),
        labelOrigin: new google.maps.Point(10, 30),
      },
      label: { color: '#000000', fontWeight: 'bold', fontSize: '14px', text: 'test2' }
    },
    photo: {
      draggable: false,
      icon: {
        url: this.baseAppUrl + '/images/red_dot.png'
      }
    },
    music: {
      draggable: false,
      icon: {
        url: this.baseAppUrl + '/images/blue_dot.png'
      }
    },
    watch: {
      draggable: false,
      icon: {
        url: this.baseAppUrl + '/images/blue_dot.png'
      }
    },
    website: {
      draggable: false,
      icon: {
        url: this.baseAppUrl + '/images/blue_dot.png'
      }
    },
  };
  readonly polylineOptions = {geodesic: true, zIndex: 11, strokeColor: '#33BBFF', strokeOpacity: 1, strokeWeight: 6};
  readonly polylineBorderOptions = {geodesic: true, zIndex: 10, strokeColor: '#FFFFFF', strokeOpacity: 1, strokeWeight: 8};
  readonly mapOptions = {
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    rotateControl: false,
    zoom: 2,
    center: {lat: 0, lng: 0},
    styles: [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#ebe3cd'
          }
        ]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#523735'
          }
        ]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#f5f1e6'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#c9b2a6'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#dcd2be'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ae9e90'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#93817c'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#a5b076'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#447530'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5f1e6'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#fdfcf8'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f8c967'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e9bc62'
          }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e98d58'
          }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#db8555'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#806b63'
          }
        ]
      },
      {
        featureType: 'transit',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8f7d77'
          }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ebe3cd'
          }
        ]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#b9d3c2'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#92998d'
          }
        ]
      }
    ]
  };

  formatQuery(params): string {

    const query = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');

    return (query ? '?' + query : '');
  }

  formatDuration(seconds): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);

    return (h > 0 ? h + 'h' + m + 'min' : m > 0 ? m + 'min' : s + 'sec');
  }

  formatTime(timestamp): string {
    const date = new Date(timestamp * 1000);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();

    return hours + ':' + minutes.substr(-2);
  }

  formatDate(timestamp): string {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('en-US', options);
  }

  formatDistance(meters): string {
    const km = Math.floor(meters / 1000);
    const m = Math.floor(meters);

    return (km > 0 ? km + 'km' : m > 0 ? m + 'm' : 'still');
  }

  formatMovement(segment: Segment): string {
    const duration = segment.duration.end - segment.duration.start;
    const velocity = segment.distance / duration;

    return velocity === 0 ? duration > 900 ? 'Stayed' : 'Stop' : velocity < 2 ? 'Moving' : 'Driving';
  }
}
