import {Component, Input, OnInit} from '@angular/core';
import {Music} from '../../models/Music.model';
import {Source} from '../../models/Source.model';
import {ExternalService} from '../../services/external.service';

@Component({
  selector: 'app-musics',
  templateUrl: './musics.component.html',
  styleUrls: ['./musics.component.scss']
})
export class MusicsComponent implements OnInit {

  @Input() musics: Music[];
  @Input() context: any;

  constructor(private externalService: ExternalService) { }

  ngOnInit(): void {

    for (const music of this.musics) {
      const params = {
        sourceId: this.context.source._id,
        apiId: this.context.api._id,
        track: music.track,
        artist: music.artists[0]
      };
      this.externalService.getExternalContext(params)
        .subscribe((result: any) => {
          music.albumUrl = result.tracks[0].album.images[0].url;
        });
    }
  }

}
