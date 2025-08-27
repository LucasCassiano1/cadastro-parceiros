import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface ViaCepResponse {
cep: string;
logradouro: string;
complemento: string;
bairro: string;
localidade: string;
uf: string;
ibge: string;
gia?: string;
ddd?: string;
siafi?: string;
erro?: boolean;
}


@Injectable({ providedIn: 'root' })
export class CepService {
constructor(private http: HttpClient) {}


buscar(cep: string): Observable<ViaCepResponse> {
const digits = (cep || '').replace(/\D/g, '');
const url = `${environment.viaCepBaseUrl}/${digits}/json/`;
return this.http.get<ViaCepResponse>(url).pipe(
map((res: any) => res as ViaCepResponse)
);
}
}