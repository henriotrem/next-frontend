import {Component, Input, OnInit} from '@angular/core';
import {Watch} from '../../models/Watch.model';
import {Source} from '../../models/Source.model';

@Component({
  selector: 'app-watches',
  templateUrl: './watches.component.html',
  styleUrls: ['./watches.component.scss']
})
export class WatchesComponent implements OnInit {

  @Input() watches: Watch[];
  @Input() source: Source;

  constructor() { }

  ngOnInit(): void {
  }

}
