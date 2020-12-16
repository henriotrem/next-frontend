import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {GoogleMap} from '@angular/google-maps';
import {Segment} from '../../models/Segment.model';
import {ConstantsService} from '../../services/constants.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @Input() segments: Segment[];

  markers: google.maps.LatLngLiteral[] = [];
  markerOptions = {draggable: false, icon: {
      url: this.constantsService.baseAppUrl + '/images/marker.png',
      anchor: new google.maps.Point(10, 10)
    }};

  polylines = [];
  polylineBorders = [];
  polylineOptions = {geodesic: true, zIndex: 11, strokeColor: '#33BBFF', strokeOpacity: 1, strokeWeight: 6};
  polylineBorderOptions = {geodesic: true, zIndex: 10, strokeColor: '#FFFFFF', strokeOpacity: 1, strokeWeight: 8};

  constructor(public constantsService: ConstantsService) { }

  ngAfterViewInit(): void {
    this.onSegmentsChange();
  }

  onSegmentsChange(): void {

    this.markers = [];
    this.polylines = [];
    this.polylineBorders = [];

    const bounds = new google.maps.LatLngBounds();

    for (let i = 0; i < this.segments.length; i++) {

      const segment = this.segments[i];
      const previous = i > 0 ? this.segments[i - 1] : null;
      const next = i < (this.segments.length - 1) ? this.segments[i + 1] : null;

      bounds.extend(this.createMarker(segment.location));

      if (segment.path.length > 0) {

        const polyline = [];

        if (previous) {
          polyline.push(this.createMarker(previous.location));
        }

        for (const location of segment.path) {
          polyline.push(this.createMarker(location));
        }

        if (next) {
          polyline.push(this.createMarker(next.location));
        }

        this.polylineBorders.push(polyline);
        this.polylines.push(polyline);
      } else {

        this.markers.push(this.createMarker(segment.location));
      }
    }

    this.map.fitBounds(bounds);
  }

  createMarker(location: any): any {
    return {lat: location.latitude, lng: location.longitude};
  }
}
