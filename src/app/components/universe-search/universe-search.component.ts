import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {Universe} from '../../models/Universe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UniversesService} from '../../services/universes.service';
import {PhotosService} from '../../services/photos.service';
import {Photo} from '../../models/Photo.model';
import {GoogleMap} from '@angular/google-maps';
import {ConstantsService} from '../../services/constants.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PositionsService} from '../../services/positions.service';
import {Position} from '../../models/Position.model';
import {MusicsService} from '../../services/musics.service';

@Component({
  selector: 'app-universe-search',
  templateUrl: './universe-search.component.html',
  styleUrls: ['./universe-search.component.scss']
})
export class UniverseSearchComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {

      this.onResumeSearch();
    }
  }

  universe: Universe;
  photos: Photo[] = [];
  positions: Position[] = [];

  connected = false;
  bounds = null;
  searchForm: FormGroup;

  currentPosition = {lat: 0, lng:0};
  currentPositionOptions = {draggable: false, icon: {url: this.constantsService.baseAppUrl + '/images/blue_dot.png'}};

  markerPositions: google.maps.LatLngLiteral[] = [];
  markerOptions = {draggable: false, icon: {url: this.constantsService.baseAppUrl + '/images/red_dot.png'}};

  constructor(private route: ActivatedRoute,
              private universesService: UniversesService,
              private musicsService: MusicsService,
              private positionsService: PositionsService,
              public constantsService: ConstantsService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {

    this.initForm();

    navigator.geolocation.getCurrentPosition((position) => {

      this.bounds = new google.maps.LatLngBounds();
      this.connected = true;

      this.currentPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }

      this.map.panTo(this.currentPosition);

      this.searchForm.patchValue({
        geospatiality: {
          origin: {
            lat: this.currentPosition.lat,
            lng: this.currentPosition.lng
          }
        }
      });
    })

    this.universe = new Universe('', '', null, 0, 0);
    const key = this.route.snapshot.params.key;

    this.universesService.getUniverse(key).then(
      (universe: Universe) => {
        this.universe = universe;
      }
    );
  }

  initForm(): void {

    this.searchForm = this.formBuilder.group({
      loads: [1, [Validators.required]],
      step: [10, [Validators.required]],
      geospatiality: this.formBuilder.group({
        origin: this.formBuilder.group({
          lat: [this.currentPosition.lat, [Validators.required]],
          lng: [this.currentPosition.lng, [Validators.required]]
        }),
        ratio: [20036, [Validators.required]],
        distance: [0, [Validators.required]],
        direction: this.formBuilder.group({
          min: null,
          max: null
        })
      }),
      temporality: this.formBuilder.group({
        origin: [(Date.now()/1000), [Validators.required]],
        ratio: [31556952, [Validators.required]],
        distance: [0, [Validators.required]],
        direction: null
      })
    });
  }

  onViewUniverse(universe: Universe): void {
    this.router.navigate(['/universes', 'view', universe.key]);
  }

  onDeleteUniverse(universe: Universe): void {
    this.universesService.removeUniverse(universe);
    this.router.navigate(['/universes']);
  }

  onSearch(): void {

    this.photos = [];
    this.markerPositions = [];

    if(this.connected)
      this.bounds = new google.maps.LatLngBounds();

    const universes = [this.route.snapshot.params.key];
    let loads = this.searchForm.get('loads').value;
    const step = this.searchForm.get('step').value;
    const origin = {
      'geospatiality': [
        this.searchForm.get('geospatiality.origin.lat').value,
        this.searchForm.get('geospatiality.origin.lng').value
      ],
      'temporality': this.searchForm.get('temporality.origin').value
    };
    const filter = {
      'geospatiality': {
        ratio: this.searchForm.get('geospatiality.ratio').value,
        distance : this.searchForm.get('geospatiality.distance').value,
        direction : [
            this.searchForm.get('geospatiality.direction.min').value,
            this.searchForm.get('geospatiality.direction.max').value
          ]
      },
      'temporality': {
        ratio: this.searchForm.get('temporality.ratio').value,
        distance : this.searchForm.get('temporality.distance').value,
        direction : this.searchForm.get('temporality.direction').value
      }
    };

    this.universesService.initSearch(universes, origin , filter, step, (universe, ids, elements) => {

      for(let element of elements) {
        let position = {
          lat: (element.index[0].bounds[0] + element.index[0].bounds[2])/2,
          lng: (element.index[0].bounds[1] + element.index[0].bounds[3])/2
        };

        if(this.connected)
          this.bounds.extend(position);

        this.markerPositions.push(position);
      }

      if (this.connected) {
        this.map.fitBounds(this.bounds);
      }

      if(universe === 'listen') {
        this.musicsService.getMusics(null).subscribe(
          (result) => {
            this.photos.push(...result.photos);

            if (elements.length > 0 && --loads > 0)
              this.onResumeSearch();
          }
        )
      }

    });
  }

  onResumeSearch(): void {
    this.universesService.resumeSearch();
  }

  onViewPhoto(photo: Photo): void {
    this.router.navigate(['/photos', 'view', photo._id]);
  }

  onBack(): void {
    this.router.navigate(['/universes']);
  }
}
