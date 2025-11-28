import { FormUtils } from '@/utils/form-utils';
import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
  styleUrl: './form-error-label.css',
})
export class FormErrorLabel {
  //El abstract control hace que venga con todos su errores
  control = input.required<AbstractControl>();

  //Es un getter que devuelve:
  //El mensaje de error correspondiente al control del formulario
  //O null si no hay error o el usuario aún no ha tocado el campo
  get errorMessage() {
    //this.control().errors devuelve un objeto con los errores del control.
    //Si errors es null o undefined, usamos {} (objeto vacío).
    const errors: ValidationErrors = this.control().errors || {};
    //this.control().touched -->Devuelve true solo si el usuario ya ha interactuado con el campo.
    //Esto evita mostrar errores mientras el usuario escribe por primera vez.
    //Object.keys(errors).length > 0 -->Devuelve true si el control tiene al menos un error.
    //FormUtils.getTextError(errors) -->Transforma el objeto de errores en un texto legible para mostrar al usuario.
    //:null --> Si no hay errores devolvemos null
    return this.control().touched && Object.keys(errors).length > 0 ? FormUtils.getTextError(errors) : null;
  }
}
