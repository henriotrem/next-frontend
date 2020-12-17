import {Component, Input, OnInit} from '@angular/core';
import {Watch} from '../../models/Watch.model';

@Component({
  selector: 'app-watches',
  templateUrl: './watches.component.html',
  styleUrls: ['./watches.component.scss']
})
export class WatchesComponent implements OnInit {

  @Input() watches: Watch[];

  constructor() { }

  ngOnInit(): void {
  }

}
