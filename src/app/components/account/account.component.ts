import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Source} from '../../models/Source.model';
import {Subscription} from 'rxjs';
import {SourcesService} from '../../services/sources.service';
import {AuthService} from '../../services/auth.service';
import {ConstantsService} from '../../services/constants.service';
import {ExternalService} from '../../services/external.service';
import {User} from '../../models/User.model';
import {Router} from '@angular/router';
import {PositionsService} from '../../services/positions.service';
import {MusicsService} from '../../services/musics.service';
import {WatchesService} from '../../services/watches.service';
import {WebsitesService} from '../../services/websites.service';
import {PhotosService} from '../../services/photos.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  @ViewChild('nav') nav;

  account: User;

  sources: Source[] = [];
  sourcesSubscription: Subscription;

  constructor(private authService: AuthService,
              private sourcesService: SourcesService,
              private externalService: ExternalService,
              private positionsService: PositionsService,
              private photosService: PhotosService,
              private musicsService: MusicsService,
              private watchesService: WatchesService,
              private websitesService: WebsitesService,
              private constantsService: ConstantsService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.getAccount();
    this.getSources();
  }

  getAccount(): void {
    this.authService.getAccount().subscribe(
      (account) => {
        this.account = account;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSources(): void {
    this.sourcesService.getSources({}).subscribe(
      (result) => {
        this.sources = result.sources;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDeleteService(source: Source): void {
    this.sourcesService.deleteSources([source]);
  }

  onNewGoogleMapsHistory(): void {
    const source = new Source('Google Maps History', 'location-file');
    this.sourcesService.addSources([source]).subscribe(
      (result) => {
        this.sources.push(...result.sources);
        this.nav.select('locations');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onNewGooglePlacesAPI(): void {
    const source = new Source('Google Places API', 'location-api-context');
    this.sourcesService.addSources([source]).subscribe(
      (result) => {
        this.sources.push(...result.sources);
        this.nav.select('locations');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onNewGooglePhotoAPI(): void {
    const source = new Source('Google Photo API', 'photo-api-data-oauth2');
    this.sourcesService.addSources([source]).subscribe(
      (result) => {
        this.sources.push(...result.sources);
        this.nav.select('photos');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onNewSpotifyHistory(): void {
    const source = new Source('Spotify History', 'music-file');
    this.sourcesService.addSources([source]).subscribe(
      (result) => {
        this.sources.push(...result.sources);
        this.nav.select('musics');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onNewSpotifyAPI(): void {
    const source = new Source('Spotify API', 'music-api-context-oauth2');
    this.sourcesService.addSources([source]).subscribe(
      (result) => {
        this.sources.push(...result.sources);
        this.nav.select('musics');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onNewYoutubeHistory(): void {
    const source = new Source('Youtube History', 'watch-file');
    this.sourcesService.addSources([source]).subscribe(
      (result) => {
        this.sources.push(...result.sources);
        this.nav.select('watches');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onLogOut(): void {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.sourcesSubscription.unsubscribe();
  }

  locationFilter(source: Source): boolean {
    return source.type.indexOf('location') !== -1;
  }
  photoFilter(source: Source): boolean {
    return source.type.indexOf('photo') !== -1;
  }
  musicFilter(source: Source): boolean {
    return source.type.indexOf('music') !== -1;
  }
  watchFilter(source: Source): boolean {
    return source.type.indexOf('watch') !== -1;
  }
  websiteFilter(source: Source): boolean {
    return source.type.indexOf('website') !== -1;
  }

  sourceFilter(name: string): boolean {
    return this.sources.filter(s => s.name === name).length === 0;
  }
}
