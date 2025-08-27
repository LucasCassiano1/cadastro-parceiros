import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Parceiro } from '../models/parceiro.model';

@Injectable({
  providedIn: 'root'
})
export class ParceiroService {
  private base = `${environment.apiBaseUrl}/Parceiros`;

  constructor(private http: HttpClient) {}

  create(parceiro: Parceiro): Observable<any> {
    return this.http.post(this.base, parceiro);
  }
}
