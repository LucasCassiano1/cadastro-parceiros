import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Parceiro, Personalidade } from '../../../app/core/models/parceiro.model';
import { CepService, ViaCepResponse } from '../../core/services/cep.service';
import { CnpjService } from '../../core/services/cnpj.service';
import { ParceiroService } from '../../core/services/parceiro.service';

import {
  applyDocumentoMask,
  applyCepMask,
  applyPhoneMask
} from '../../core/utils/mask.util';

@Component({
  selector: 'app-parceiro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parceiro-form.component.html',
  styleUrls: ['./parceiro-form.component.css']
})
export class ParceiroFormComponent implements OnInit, OnDestroy {
  parceiroForm!: FormGroup;
  loadingCep = false;
  loadingCnpj = false;
  submitting = false;
  successMsg: string | null = null;
  errorMsg: string | null = null;

  readonly ufs = [
    'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'
  ];

  private subs: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private cepService: CepService,
    private cnpjService: CnpjService,
    private parceiroService: ParceiroService
  ) {}

  ngOnInit(): void {
    this.parceiroForm = this.fb.group({
      personalidade: ['JURIDICA', Validators.required],
      razaoSocial: ['', [Validators.required, Validators.minLength(2)]],
      documento: ['', [Validators.required]],
      cep: ['', [Validators.required]],
      uf: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      logradouro: ['', [Validators.required]],
      numero: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required]],
      complemento: [''],
      observacao: ['']
    });

    // manter reatividade quando trocar personalidade (FISICA/JURIDICA)
    const s = this.parceiroForm.get('personalidade')!.valueChanges.subscribe((p: Personalidade) => {
      // limpa documento ao trocar tipo e reseta validações (opcional)
      this.parceiroForm.get('documento')!.setValue('');
    });
    this.subs.push(s);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  // ===================== Helpers UI =====================
  showError(controlName: string, errorKey?: string): boolean {
    const c = this.parceiroForm.get(controlName);
    if (!c) return false;
    if (!c.touched && !c.dirty) return false;
    if (errorKey) return !!c.errors?.[errorKey];
    return c.invalid;
  }

  // ===================== Máscaras (tempo real) =====================
  onDocumentoInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const personalidade = (this.parceiroForm.get('personalidade')?.value || 'JURIDICA') as Personalidade;
    const masked = applyDocumentoMask(input.value, personalidade);
    this.parceiroForm.get('documento')?.setValue(masked, { emitEvent: false });
  }

  onCepInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.parceiroForm.get('cep')?.setValue(applyCepMask(input.value), { emitEvent: false });
  }

  onTelefoneInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.parceiroForm.get('telefone')?.setValue(applyPhoneMask(input.value), { emitEvent: false });
  }

  // ===================== CEP: blur e botão =====================
  // chamado no (blur) do campo
  onCepBlur(): void {
    // delega para a função de busca (mesma lógica)
    this.onBuscarCep();
  }

  // chamado no (click) do botão
  onBuscarCep(): void {
    const cepVal = (this.parceiroForm.get('cep')?.value || '').replace(/\D/g, '');
    if (!cepVal || cepVal.length !== 8) return;

    this.loadingCep = true;
    this.cepService.buscar(cepVal).subscribe({
      next: (res: ViaCepResponse) => {
        if ((res as any).erro) {
          alert('CEP não encontrado');
          this.loadingCep = false;
          return;
        }
        this.parceiroForm.patchValue({
          logradouro: res.logradouro || this.parceiroForm.get('logradouro')?.value,
          bairro: res.bairro || this.parceiroForm.get('bairro')?.value,
          municipio: res.localidade || this.parceiroForm.get('municipio')?.value,
          uf: res.uf || this.parceiroForm.get('uf')?.value
        });
        this.loadingCep = false;
      },
      error: () => {
        alert('Erro ao consultar CEP');
        this.loadingCep = false;
      }
    });
  }

  // ===================== CNPJ: blur e botão =====================
  // chamado no (blur) do documento
  onDocumentoBlur(): void {
    const personalidade = (this.parceiroForm.get('personalidade')?.value || 'JURIDICA') as Personalidade;
    if (personalidade !== 'JURIDICA') return;

    const doc = (this.parceiroForm.get('documento')?.value || '').replace(/\D/g, '');
    if (doc.length !== 14) return;

    this.onBuscarCnpj(); // reaproveita
  }

  // chamado no (click) do botão
  onBuscarCnpj(): void {
    const cnpj = (this.parceiroForm.get('documento')?.value || '').replace(/\D/g, '');
    if (!cnpj || cnpj.length !== 14) return;

    this.loadingCnpj = true;
    this.cnpjService.consultar(cnpj).subscribe({
      next: (dados: { razaoSocial: string | null }) => {
        if (dados.razaoSocial) {
          this.parceiroForm.get('razaoSocial')?.setValue(dados.razaoSocial);
        }
        this.loadingCnpj = false;
      },
      error: () => {
        alert('CNPJ não encontrado');
        this.loadingCnpj = false;
      }
    });
  }

  // ===================== Submissão =====================
  onSubmit(): void {
    this.successMsg = null;
    this.errorMsg = null;

    if (this.parceiroForm.invalid) {
      this.parceiroForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const raw = this.parceiroForm.getRawValue();

    const payload: Parceiro = {
      personalidade: raw.personalidade,
      razaoSocial: raw.razaoSocial,
      documento: (raw.documento || '').replace(/\D/g, ''),
      cep: (raw.cep || '').replace(/\D/g, ''),
      uf: (raw.uf || '').toUpperCase(),
      municipio: raw.municipio,
      logradouro: raw.logradouro,
      numero: raw.numero,
      bairro: raw.bairro,
      email: raw.email,
      telefone: (raw.telefone || '').replace(/\D/g, ''),
      complemento: raw.complemento || '',
      observacao: raw.observacao || ''
    };

    this.parceiroService.create(payload).subscribe({
      next: (res) => {
        this.successMsg = res?.message || 'Parceiro cadastrado com sucesso!';
        this.parceiroForm.reset({ personalidade: raw.personalidade });
        this.submitting = false;
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'Erro ao enviar os dados';
        this.errorMsg = msg;
        this.submitting = false;
      }
    });
  }
}
