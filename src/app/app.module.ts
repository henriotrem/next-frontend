import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { ConstantsService } from './services/constants.service';
import { CallbackPipe } from './pipes/callback.pipe';

import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { AuthGuardService} from './services/auth-guard.service';
import { AuthService } from './services/auth.service';

import { GoogleMapsModule } from '@angular/google-maps';
import { PositionsService } from './services/positions.service';
import { SegmentsService } from './services/segments.service';

import { PhotosService } from './services/photos.service';

import { YouTubePlayerModule } from '@angular/youtube-player';

import { AccountComponent } from './components/account/account.component';
import { SourceComponent } from './components/source/source.component';
import { ApiComponent } from './components/api/api.component';
import { FileComponent } from './components/file/file.component';
import { SourcesService } from './services/sources.service';
import { FilesService } from './services/files.service';

import { ExternalService } from './services/external.service';
import { WindowService } from './services/window.service';

import { TimelineComponent } from './components/timeline/timeline.component';
import { UniverseSearchComponent } from './components/universe-search/universe-search.component';
import { UniversesService } from './services/universes.service';
import { YoutubeComponent } from './components/youtube/youtube.component';

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'timeline', canActivate: [AuthGuardService], component: TimelineComponent },
  { path: 'universes/search/:key', canActivate: [AuthGuardService], component: UniverseSearchComponent },
  { path: 'account', canActivate: [AuthGuardService], component: AccountComponent },
  { path: '', redirectTo: 'timeline', pathMatch: 'full'},
  { path: '**', redirectTo: 'timeline'},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    CallbackPipe,
    TimelineComponent,
    UniverseSearchComponent,
    AccountComponent,
    FileComponent,
    ApiComponent,
    YoutubeComponent,
    SourceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GoogleMapsModule,
    YouTubePlayerModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    NgbModule
  ],
  providers: [
    ConstantsService,
    AuthService,
    AuthGuardService,
    PositionsService,
    SegmentsService,
    PhotosService,
    SourcesService,
    FilesService,
    ExternalService,
    WindowService,
    UniversesService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
