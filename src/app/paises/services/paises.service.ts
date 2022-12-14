import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseURL: string = 'https://restcountries.com/v3.1';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {
    const fields: string = '?fields=name,cca3';
    return this.http.get<PaisSmall[]>(`${this.baseURL}/region/${region}${fields}`);
  }
  
  getPaisPorAlpha( code: string ): Observable<Pais[] | null> {       
    if(!code){
      return of(null)
    }
    return this.http.get<Pais[]>(`${this.baseURL}/alpha/${code}`);
  }

  getNombrePaisXAlpha( code: string ): Observable<PaisSmall>{
    const fields: string = '?fields=name,cca3';
    return this.http.get<PaisSmall>( `${this.baseURL}/alpha/${code}${fields}`)
  }

  getPaisesPorAlpha ( borders: string[]): Observable<PaisSmall[]>{
    if(!borders){
      return of([]);
    }
    const peticiones: Observable<PaisSmall>[] =[];
    
    borders.forEach( codigo => {
      const peticion = this.getNombrePaisXAlpha(codigo);
      peticiones.push(peticion);
    });

    return combineLatest( peticiones );

  }

}
