import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface CnpjPublicResponse {
razao_social?: string;
nome_fantasia?: string;
}


@Injectable({ providedIn: 'root' })
export class CnpjService {
constructor(private http: HttpClient) {}


consultar(cnpj: string): Observable<{ razaoSocial: string | null }> {
const digits = (cnpj || '').replace(/\D/g, '');
const url = `${environment.cnpjBaseUrl}/${digits}`;
return this.http.get<CnpjPublicResponse>(url).pipe(
map((res) => ({
razaoSocial: res?.razao_social || res?.nome_fantasia || null,
}))
);
}
}