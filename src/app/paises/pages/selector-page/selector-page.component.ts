import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
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
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false; 

  constructor( private fb: FormBuilder,
               private paisesService: PaisesService ) { }


  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie la region 
    this.miForm.get('region')?.valueChanges 
        .pipe(
          tap( () => {
            this.miForm.get('pais')?.reset('');
            this.cargando = true;
          }),
          switchMap( region => this.paisesService.getPaisesPorRegion(region))              
        )
        .subscribe( paises => {  
          this.paises = paises 
          this.cargando = false;         
        });      

    this.miForm.get('pais')?.valueChanges
        .pipe(
          tap( () => {
            this.fronteras = [];
            this.miForm.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( alpha => this.paisesService.getPaisPorAlpha(alpha)),
          switchMap( pais => this.paisesService.getPaisesPorAlpha( pais ? pais![0]?.borders : []))
        )
        .subscribe( paises => {                            
              this.fronteras = paises;
              this.cargando = false;                
    });
  }
  

  guardar(){
    console.log(this.miForm.value);
  }
}
