import {Component, OnInit, ViewChild} from '@angular/core';
import {Universe} from '../../models/Universe.model';
import {ActivatedRoute} from '@angular/router';
import {UniversesService} from '../../services/universes.service';
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

  universe: Universe;
  positions: Position[] = [];
  loads: 1;

  searchForm: FormGroup;

  currentPosition = {lat: 0, lng: 0};
  currentPositionOptions = {draggable: false, icon: {url: this.constantsService.baseAppUrl + '/images/blue_dot.png'}};

  markerPositions: google.maps.LatLngLiteral[] = [];
  markerOptions = {draggable: false, icon: {url: this.constantsService.baseAppUrl + '/images/red_dot.png'}};

  constructor(private route: ActivatedRoute,
              private universesService: UniversesService,
              private musicsService: MusicsService,
              private positionsService: PositionsService,
              public constantsService: ConstantsService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.initForm();

    this.universe = new Universe('', '', null, 0, 0);

    this.universesService.getUniverse(this.route.snapshot.params.key).subscribe((universe: Universe) => {
      this.universe = universe;
    });
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
        origin: [(Date.now() / 1000), [Validators.required]],
        ratio: [31556952, [Validators.required]],
        distance: [0, [Validators.required]],
        direction: null
      })
    });
  }

  onSearch(): void {

    this.markerPositions = [];
    this.currentPosition = {
      lat: this.searchForm.get('geospatiality.origin.lat').value,
      lng: this.searchForm.get('geospatiality.origin.lng').value,
    };

    const universes = [this.route.snapshot.params.key, "building"];
    this.loads = this.searchForm.get('loads').value;
    const step = this.searchForm.get('step').value;
    const origin = {
      geospatiality: [
        this.currentPosition.lat,
        this.currentPosition.lng
      ],
      temporality: this.searchForm.get('temporality.origin').value
    };
    const filter = {
      geospatiality: {
        ratio: this.searchForm.get('geospatiality.ratio').value,
        distance : this.searchForm.get('geospatiality.distance').value,
        direction : [
            this.searchForm.get('geospatiality.direction.min').value,
            this.searchForm.get('geospatiality.direction.max').value
          ]
      },
      temporality: {
        ratio: this.searchForm.get('temporality.ratio').value,
        distance : this.searchForm.get('temporality.distance').value,
        direction : this.searchForm.get('temporality.direction').value
      }
    };

    this.universesService.initSearch(universes, origin , filter, step, (universe, ids, elements) => {

      for (const element of elements) {
        const position = {
          lat: (element.index[0].bounds[0] + element.index[0].bounds[2]) / 2,
          lng: (element.index[0].bounds[1] + element.index[0].bounds[3]) / 2
        };

        this.markerPositions.push(position);

        console.log(element);
      }

      if (elements.length > 0 && --this.loads > 0) {
        this.universesService.resumeSearch();
      }

    });
  }

  onResumeSearch(): void {
    this.loads = this.searchForm.get('loads').value;
    this.universesService.resumeSearch();
  }
}
