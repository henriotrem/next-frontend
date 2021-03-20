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
  @Input() activities: any;

  markers = [];
  polylines = [];
  polylineBorders = [];

  constructor(public constantsService: ConstantsService) { }

  ngAfterViewInit(): void {
    this.onSegmentsChange();
  }

  onSegmentsChange(): void {

    this.markers = [];
    this.polylines = [];
    this.polylineBorders = [];

    const bounds = new google.maps.LatLngBounds();

    for (let i = 0; i < this.activities.length; i++) {

      const segment = this.activities[i].segment;
      const previous = i > 0 ? this.activities[i - 1].segment : null;
      const next = i < (this.activities[i].segment.length - 1) ? this.activities[i + 1].segment : null;

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
        const marker = {
          location: this.createMarker(segment.location),
          options: this.constantsService.markerOptions.stop
        };
        marker.options.label.text = 'test';
        this.markers.push(marker);
      }

      for (const content of this.activities[i].contents) {
        for (const item of content.data) {
          const marker = {
            location: this.createMarker(this.calculateLocation(item, segment)),
            options: this.constantsService.markerOptions[content.type.toLowerCase()]
          };
          this.markers.push(marker);
        }
      }
    }

    this.map.fitBounds(bounds);
  }

  calculateLocation(item: any, segment: Segment): any {
    let previous = {
      ...segment.location,
      timestamp: segment.duration.start
    };
    for (const next of segment.path) {
      if (next.timestamp > item.temporality) {
        const ratio = (item.temporality - previous.timestamp) / (next.timestamp - previous.timestamp);
        const location = {
          latitude: previous.latitude + (next.latitude - previous.latitude) * ratio,
          longitude: previous.longitude + (next.longitude - previous.longitude) * ratio
        };
        console.log(item);
        console.log(segment);
        console.log(ratio);
        console.log(location);
        return location;
      }
      previous = next;
    }
    const result = {
      latitude: segment.location.latitude,
      longitude: segment.location.longitude
    };
    return result;
  }

  createMarker(location: any): any {
    return {lat: location.latitude, lng: location.longitude};
  }
}
