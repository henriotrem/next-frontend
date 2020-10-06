import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Universe} from "../models/Universe.model";
import {Subscription} from "rxjs";
import {UniversesService} from "../services/universes.service";
import {Router} from "@angular/router";
import {GoogleMap} from "@angular/google-maps";
import {Segment} from "../models/Segment.model";
import {SegmentsService} from "../services/segments.service";
import {ConstantsService} from "../services/constants.service";
import {Photo} from "../models/Photo.model";
import {PhotosService} from "../services/photos.service";

@Component({
  selector: 'app-universe-list',
  templateUrl: './universe-list.component.html',
  styleUrls: ['./universe-list.component.scss']
})
export class UniverseListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  timestamp = 1599661800;

  universes: Universe[];
  universesSubscription: Subscription;

  segments: Segment[];
  segmentsSubscription: Subscription;

  markers: google.maps.LatLngLiteral[] = [];
  markerOptions = {draggable: false, icon: {
      url: this.constantsService.baseAppUrl + "/images/marker.png",
      anchor: new google.maps.Point(10, 10)
    }};

  polylines = [];
  polylineBorders = [];
  polylineOptions = {geodesic: true, zIndex:11, strokeColor: "#33BBFF", strokeOpacity: 1, strokeWeight: 6};
  polylineBorderOptions = {geodesic: true, zIndex:10, strokeColor: "#FFFFFF", strokeOpacity: 1, strokeWeight: 8};

  gallery: Photo[][];
  columns = 4;
  photosSubscription: Subscription;

  constructor(private universesService: UniversesService,
              private photosService: PhotosService,
              private segmentsService: SegmentsService,
              public constantsService: ConstantsService,
              private router: Router) { }

  formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);

    return (h > 0 ? h + 'h' + m + 'min' : m > 0 ? m + 'min' : s + 'sec');
  }

  formatTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();

    return hours + ':' + minutes.substr(-2)
  }

  formatDistance(meters) {
    const km = Math.floor(meters / 1000);
    const m = Math.floor(meters);

    return (km > 0 ? km + 'km' : m > 0 ? m + 'm' : 'still');
  }

  formatMovement(segment: Segment) {
    let duration = segment.duration.end-segment.duration.start;
    let velocity = segment.distance / duration;

    return velocity === 0 ? duration > 900 ? 'Stayed' : 'Stop' : velocity < 2 ? 'Moving' : 'Driving';
  }

  ngOnInit(): void {

    this.photosSubscription = this.photosService.photosSubject.subscribe(
      (photos: Photo[]) => {

        this.gallery = [];

        for(let c = 0; c < this.columns; c++) {
          this.gallery[c] = [];
          for (let i = c; i < photos.length; i = i + this.columns)
            this.gallery[c].push(photos[i]);
        }

      }
    );
    this.photosService.getAllPhotos(this.timestamp);
    this.photosService.emitPhotos();

    this.segmentsSubscription = this.segmentsService.segmentsSubject.subscribe(
      (segments: Segment[]) => {

        this.segments = segments;
        this.markers = [];
        this.polylines = [];
        this.polylineBorders = [];

        let bounds = new google.maps.LatLngBounds();

        for(let i = 0; i < segments.length; i++) {

          let segment = segments[i];
          let previous = i > 0 ? segments[i-1] : null;
          let next = i < (segments.length - 1) ? segments[i+1] : null;

          bounds.extend(this.createMarker(segment.location));

          if(segment.path.length > 0) {

            let polyline = [];

            if(previous)
              polyline.push(this.createMarker(previous.location))

            for(let location of segment.path)
              polyline.push(this.createMarker(location));

            if(next)
              polyline.push(this.createMarker(next.location))

            this.polylineBorders.push(polyline);
            this.polylines.push(polyline);
          } else {

            this.markers.push(this.createMarker(segment.location));
          }
        }

        this.map.fitBounds(bounds);
      }
    );

    this.universesSubscription = this.universesService.universesSubject.subscribe(
      (universes: Universe[]) => {
        this.universes = universes;
      }
    );
    this.universesService.getUniverses();
    this.universesService.emitUniverses();
  }

  onNewUniverse(): void {
    this.router.navigate(['/universes', 'new']);
  }

  onSearchUniverse(universe: Universe): void {
    this.router.navigate(['/universes', 'search', universe.key]);
  }

  onPreviousDay() {
    this.timestamp -= 3600 * 24;
    this.segmentsService.getAllSegments(this.timestamp);
    this.segmentsService.emitSegments();
    this.photosService.getAllPhotos(this.timestamp);
    this.photosService.emitPhotos();
  }

  onNextDay() {
    this.timestamp += 3600 * 24;
    this.segmentsService.getAllSegments(this.timestamp);
    this.segmentsService.emitSegments();
    this.photosService.getAllPhotos(this.timestamp);
    this.photosService.emitPhotos();
  }

  onViewPhoto(photo: Photo): void {
    this.router.navigate(['/photos', 'view', photo._id]);
  }

  ngAfterViewInit() {
    this.segmentsService.getAllSegments(this.timestamp);
    this.segmentsService.emitSegments();
  }

  createMarker(location: any): any {
    return {lat: location.latitude, lng: location.longitude}
  }

  ngOnDestroy(): void {
    this.universesSubscription.unsubscribe();
    this.segmentsSubscription.unsubscribe();
  }

}
