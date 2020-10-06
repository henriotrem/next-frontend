import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UniversesService} from '../../services/universes.service';
import {Router} from '@angular/router';
import {Universe} from '../../models/Universe.model';

@Component({
  selector: 'app-universe-form',
  templateUrl: './universe-form.component.html',
  styleUrls: ['./universe-form.component.scss']
})
export class UniverseFormComponent implements OnInit {

  universeForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private universesService: UniversesService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.universeForm = this.formBuilder.group({
      key: ['awesome', [Validators.required]],
      description: ['Awesome universe!', [Validators.required]],
      dimensions: this.formBuilder.array([this.initDimensionForm()]),
      precision: [13, [Validators.required]],
      limit: [100, [Validators.required]]
    });
  }

  initDimensionForm(): any {
    return this.formBuilder.group({
      key: ['', [Validators.required]],
      base: this.formBuilder.group({
        root: ['~', [Validators.required]],
        bit: [4, [Validators.required]],
        alphabet: ['ABCDEFGHIJKLMNOP', [Validators.required]]
      })
    });
  }

  onSaveUniverse(): void {
    const key = this.universeForm.get('key').value;
    const description = this.universeForm.get('description').value;
    const dimensions = this.universeForm.value.dimensions ? this.universeForm.value.dimensions : []
    const precision = this.universeForm.get('precision').value;
    const limit = this.universeForm.get('limit').value;

    const universe = new Universe(key, description, dimensions, precision, limit);

    this.universesService.addUniverse(universe);
    this.router.navigate(['/universes']);
  }

  getDimensions(): FormArray {
    return this.universeForm.get('dimensions') as FormArray;
  }

  onAddDimension(): void {
    this.getDimensions().push(this.initDimensionForm());
  }

  onBack(): void {
    this.router.navigate(['/universes']);
  }
}
