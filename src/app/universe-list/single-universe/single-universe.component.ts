import { Component, OnInit } from '@angular/core';
import {Universe} from '../../models/Universe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {UniversesService} from '../../services/universes.service';

@Component({
  selector: 'app-single-universe',
  templateUrl: './single-universe.component.html',
  styleUrls: ['./single-universe.component.scss']
})
export class SingleUniverseComponent implements OnInit {

  universe: Universe;

  constructor(private route: ActivatedRoute,
              private universesService: UniversesService,
              private router: Router) { }

  ngOnInit(): void {
    this.universe = new Universe('', '', null, 0, 0);
    const key = this.route.snapshot.params.key;

    this.universesService.getUniverse(key).then(
      (universe: Universe) => {
        this.universe = universe;
      }
    );
  }

  onBack(universe: Universe): void {
    this.router.navigate(['/universes/search/'+ universe.key]);
  }
}
