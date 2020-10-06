import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PhotosService} from "../../services/photos.service";
import {Router} from "@angular/router";
import {Photo} from "../../models/Photo.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-photo-form',
  templateUrl: './photo-form.component.html',
  styleUrls: ['./photo-form.component.scss']
})
export class PhotoFormComponent implements OnInit {


  photoForm: FormGroup;

  imagePreview: string;

  constructor(private formBuilder: FormBuilder,
              private photosService: PhotosService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.photoForm = this.formBuilder.group({
      title: ['Song', [Validators.required]],
      author: ['Band', [Validators.required]],
      geospatiality: this.formBuilder.array([(Math.random()-0.5)*180*0.8, (Math.random()-0.5)*360]),
      temporality: [(Date.now()/1000), [Validators.required]],
      imageUrl: ['', []],
      universes: this.formBuilder.array(['listen']),
      generate: [1, [Validators.required]],
      image: [null, Validators.required]
    });
  }

  onSavePhoto(): void {

    const userId = this.authService.userId;
    const filename = this.photoForm.get('filename').value;
    const author = this.photoForm.get('author').value;
    let geospatiality = this.photoForm.value.geospatiality ? this.photoForm.value.geospatiality : []
    let temporality = this.photoForm.get('temporality').value;
    const url = this.photoForm.get('imageUrl').value;
    const universes = this.photoForm.get('universes').value ? this.photoForm.get('universes').value : []


    for(let i = 0; i < this.photoForm.get('generate').value; i++) {

      const photo = new Photo(userId, url, filename, null, '', geospatiality, temporality, universes);
      this.photosService.addPhoto(photo);

      geospatiality= [(Math.random()-0.5)*180*0.8, (Math.random()-0.5)*360];
      temporality= (Date.now()/1000);
    }

    this.router.navigate(['/photos']);
  }

  getUniverses(): FormArray {
    return this.photoForm.get('universes') as FormArray;
  }

  onAddUniverse(): void {
    const newUniverseControl = this.formBuilder.control('', Validators.required);
    this.getUniverses().push(newUniverseControl);
  }

  onBack(): void {
    this.router.navigate(['/photos']);
  }

}
