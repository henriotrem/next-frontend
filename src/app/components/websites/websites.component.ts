import {Component, Input, OnInit} from '@angular/core';

import {Website} from '../../models/Website.model';
import {Source} from '../../models/Source.model';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.scss']
})
export class WebsitesComponent implements OnInit {

  @Input() websites: Website[];
  @Input() source: Source;

  constructor() { }

  ngOnInit(): void {
  }

}
