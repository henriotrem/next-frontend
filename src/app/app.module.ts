import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

import { UniverseListComponent } from './universe-list/universe-list.component';
import { UniverseFormComponent } from './universe-list/universe-form/universe-form.component';
import { SingleUniverseComponent } from './universe-list/single-universe/single-universe.component';

import { PhotoListComponent } from './photo-list/photo-list.component';

import { AuthGuardService} from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { UniversesService } from "./services/universes.service";

import { AuthInterceptor } from "./interceptors/auth-interceptor";
import { SinglePhotoComponent } from './photo-list/single-photo/single-photo.component';
import { PhotoFormComponent } from './photo-list/photo-form/photo-form.component';
import { UniverseSearchComponent } from './universe-list/universe-search/universe-search.component';
import {PhotosService} from "./services/photos.service";
import {GoogleMapsModule} from "@angular/google-maps";
import {ConstantsService} from "./services/constants.service";
import { FileListComponent } from './file-list/file-list.component';
import { FileFormComponent } from './file-list/file-form/file-form.component';
import {PositionsService} from "./services/positions.service";
import {FilesService} from "./services/files.service";
import {SegmentsService} from "./services/segments.service";
import { ServiceListComponent } from './service-list/service-list.component';
import {WindowService} from "./services/window.service";
import { SingleServiceComponent } from './service-list/single-service/single-service.component';
import { ServiceFormComponent } from './service-list/service-form/service-form.component';
import {ExternalService} from "./services/external.service";

const appRoutes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'universes', canActivate: [AuthGuardService], component: UniverseListComponent },
  { path: 'universes/new', canActivate: [AuthGuardService], component: UniverseFormComponent },
  { path: 'universes/view/:key', canActivate: [AuthGuardService], component: SingleUniverseComponent },
  { path: 'universes/search/:key', canActivate: [AuthGuardService], component: UniverseSearchComponent },
  { path: 'photos', canActivate: [AuthGuardService], component: PhotoListComponent },
  { path: 'photos/new', canActivate: [AuthGuardService], component: PhotoFormComponent },
  { path: 'photos/view/:id', canActivate: [AuthGuardService], component: SinglePhotoComponent },
  { path: 'services', canActivate: [AuthGuardService], component: ServiceListComponent },
  { path: 'services/new', canActivate: [AuthGuardService], component: ServiceFormComponent },
  { path: 'services/view/:id', canActivate: [AuthGuardService], component: SingleServiceComponent },
  { path: 'files', canActivate: [AuthGuardService], component: FileListComponent },
  { path: 'files/new', canActivate: [AuthGuardService], component: FileFormComponent },
  { path: 'files/view/:signature', canActivate: [AuthGuardService], component: FileFormComponent },
  { path: '', redirectTo: 'universes', pathMatch: 'full'},
  { path: '**', redirectTo: 'universes'},
];

const apiHost = '172.20.10.3:3000';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupComponent,
    LoginComponent,
    UniverseListComponent,
    UniverseFormComponent,
    SingleUniverseComponent,
    PhotoListComponent,
    SinglePhotoComponent,
    PhotoFormComponent,
    UniverseSearchComponent,
    FileListComponent,
    FileFormComponent,
    ServiceListComponent,
    SingleServiceComponent,
    ServiceFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    FilesService,
    PositionsService,
    SegmentsService,
    UniversesService,
    PhotosService,
    ConstantsService,
    WindowService,
    ExternalService,
    AuthGuardService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
