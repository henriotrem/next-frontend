import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {GoogleMap} from '@angular/google-maps';
import {Segment} from '../../models/Segment.model';
import {SegmentsService} from '../../services/segments.service';
import {ConstantsService} from '../../services/constants.service';
import {Photo} from '../../models/Photo.model';
import {MusicsService} from '../../services/musics.service';
import {Music} from '../../models/Music.model';
import {Watch} from '../../models/Watch.model';
import {WatchesService} from '../../services/watches.service';
import {ExternalService} from '../../services/external.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  timestamp = 1600300800;

  segments: Segment[];

  musics: Music[];
  watches: Watch[];
  gallery: Photo[][];
  columns = 4;

  markers: google.maps.LatLngLiteral[] = [];
  markerOptions = {draggable: false, icon: {
      url: this.constantsService.baseAppUrl + '/images/marker.png',
      anchor: new google.maps.Point(10, 10)
    }};

  polylines = [];
  polylineBorders = [];
  polylineOptions = {geodesic: true, zIndex: 11, strokeColor: '#33BBFF', strokeOpacity: 1, strokeWeight: 6};
  polylineBorderOptions = {geodesic: true, zIndex: 10, strokeColor: '#FFFFFF', strokeOpacity: 1, strokeWeight: 8};

  constructor(private externalService: ExternalService,
              private musicsService: MusicsService,
              private watchesService: WatchesService,
              private segmentsService: SegmentsService,
              public constantsService: ConstantsService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onPreviousDay(): void {
    this.timestamp -= 3600 * 24;
    this.refreshAllItems();
  }

  onNextDay(): void {
    this.timestamp += 3600 * 24;
    this.refreshAllItems();
  }

  onViewPhoto(photo: Photo): void {
    this.router.navigate(['/photos', 'view', photo._id]);
  }

  ngAfterViewInit(): void {
    this.refreshAllItems();
  }

  refreshAllItems(): void {
    this.segmentsService.getSegments({start: this.timestamp, end: this.timestamp + 3600 * 24}).subscribe(
      (result) => {

        this.segments = result.segments;
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
    );
    // this.externalService.getGooglePhotos(this.timestamp).subscribe(
    //   (photos: any) => {
    //
    //     this.gallery = [];
    //
    //     for (let c = 0; c < this.columns; c++) {
    //       this.gallery[c] = [];
    //       for (let i = c; i < photos.length; i = i + this.columns) {
    //         this.gallery[c].push(photos[i]);
    //       }
    //     }
    //
    //   }
    // );
    this.musicsService.getMusics({start: this.timestamp, end: this.timestamp + 3600 * 24}).subscribe(
      (result: any) => {

        this.musics = result.musics;

        for (const music of this.musics) {
          const params = {
            apiId: music.artists[0],
            artist: music.artists[0],
            track: music.track
          };
          this.externalService.getSpotifyTrack(params).then(
            (result) => {
              // music.spotify = result.tracks.items[0];
            }
          );
        }
      }
    );
    this.watchesService.getWatches({start: this.timestamp, end: this.timestamp + 3600 * 24}).subscribe(
      (result: any) => {

        this.watches = result.watches;
      }
    );
  }

  createMarker(location: any): any {
    return {lat: location.latitude, lng: location.longitude};
  }

  ngOnDestroy(): void {
  }
}
