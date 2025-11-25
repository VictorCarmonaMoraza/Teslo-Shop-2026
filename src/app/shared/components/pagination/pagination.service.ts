import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaginationService {

  //Para leer parametros de la URL
  private activatedRoute = inject(ActivatedRoute);

  // Leer el query param page de la URL
  currentPage = toSignal(
    // Observamos los cambios de los parámetros de la URL:
    // Por ejemplo: ?page=3 o ?page=hola
    this.activatedRoute.queryParamMap.pipe(
      // 1. Extraemos el parámetro "page"
      //    params.get('page') devuelve un string o null.
      //    Si existe, lo convertimos a número con el operador +.
      //    Si no existe, devolvemos 1 como página por defecto.
      map((params) => (params.get('page') ? +params.get('page')! : 1)),
      // 2. Validamos el valor obtenido.
      //    Si el resultado NO es un número (NaN), entonces devolvemos 1.
      //    Esto evita errores si alguien pone ?page=hola o similares.
      map(page => (isNaN(page) ? 1 : page))
    ), {
    // Valor inicial que tendrá la signal antes de recibir los valores del Observable.
    initialValue: 1,
  }
  )

}
