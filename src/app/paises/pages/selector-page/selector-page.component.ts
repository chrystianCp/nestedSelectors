import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: Pais[] = [];

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }


  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la region 
    this.miForm.get('region')?.valueChanges 
        .pipe(
          tap( () => {this.miForm.get('pais')?.reset('')} ),
          switchMap( region => this.paisesService.getPaisesPorRegion(region))              
        )
        .subscribe( paises => {           
          this.paises = paises 
        });      

    this.miForm.get('pais')?.valueChanges
        .subscribe( alpha => {    
      console.log(alpha);      
    })       
  }
  

  guardar(){
    console.log(this.miForm.value);
  }
}
