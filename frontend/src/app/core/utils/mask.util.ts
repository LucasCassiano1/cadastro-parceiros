import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

//Helpers
function onlyDigits(v: string): string {
  return (v || '').replace(/\D/g, '');
}

//Máscaras
export function applyCnpjMask(v: string): string {
  const digits = onlyDigits(v).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export function applyCpfMask(v: string): string {
  const digits = onlyDigits(v).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function applyCepMask(v: string): string {
  const digits = onlyDigits(v).slice(0, 8);
  return digits.replace(/(\d{5})(\d)/, '$1-$2');
}

export function applyPhoneMask(v: string): string {
  const digits = onlyDigits(v).slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  } else {
    return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
  }
}

//Documento (CPF/CNPJ dinâmico)
export function applyDocumentoMask(v: string, personalidade: 'FISICA' | 'JURIDICA'): string {
  return personalidade === 'JURIDICA' ? applyCnpjMask(v) : applyCpfMask(v);
}

//Validadores
export const cepValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const digits = onlyDigits(control.value);
  return digits.length === 8 ? null : { cepInvalido: true };
};

export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const digits = onlyDigits(control.value);
  return (digits.length === 10 || digits.length === 11) ? null : { telefoneInvalido: true };
};

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = onlyDigits(control.value);
    if (v.length !== 11) return { cpfInvalido: true };
    if (/^(\d)\1{10}$/.test(v)) return { cpfInvalido: true };

    const calc = (base: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < base.length; i++) total += parseInt(base[i], 10) * (factor - i);
      const rest = total % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const d1 = calc(v.slice(0, 9), 10);
    const d2 = calc(v.slice(0, 9) + d1, 11);
    return (d1 === parseInt(v[9], 10) && d2 === parseInt(v[10], 10)) ? null : { cpfInvalido: true };
  };
}

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = onlyDigits(control.value);
    if (v.length !== 14) return { cnpjInvalido: true };
    if (/^(\d)\1{13}$/.test(v)) return { cnpjInvalido: true };

    const calc = (base: string): number => {
      const factors = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      for (let i = base.length - 1, f = factors.length - 1; i >= 0; i--, f--) {
        sum += parseInt(base[i], 10) * factors[f];
      }
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const b1 = v.slice(0, 12);
    const d1 = calc(b1);
    const d2 = calc(b1 + d1);
    return (d1 === parseInt(v[12], 10) && d2 === parseInt(v[13], 10)) ? null : { cnpjInvalido: true };
  };
}
