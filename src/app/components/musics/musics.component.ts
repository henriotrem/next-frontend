import {Component, Input, OnInit} from '@angular/core';
import {Music} from '../../models/Music.model';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss']
})
export class MusicsComponent implements OnInit {

  @Input() musics: Music[];

  constructor() { }

  ngOnInit(): void {
  }

}
