import { Loaders } from './../../../../../node_modules/cosmiconfig/dist/types.d';
import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
// import { ProductCard } from "../../../products/components/product-card/product-card";
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { Pagination } from "@/shared/components/pagination/pagination";
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';


@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  //Inyectamos el servicio de productos
  private productsService = inject(ProductsService);
  //Para leer parametros de la URL
  activatedRoute = inject(ActivatedRoute);

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

  productsResource = rxResource({
    // La función params() define **de qué depende el recurso**.
    // Cada vez que currentPage() cambie, rxResource volverá a ejecutar stream().
    params: () => ({ page: this.currentPage() }),
    // stream() define cómo obtener los datos en función de los parámetros.
    // Aquí realizamos la petición HTTP al backend.
    stream: ({ params }) => {
      // Llamamos al servicio que hace la petición HTTP
      // y rxResource gestionará automaticamente:
      //  - suscripción
      //  - estados de carga
      //  - errores
      return this.productsService.getProducts({
        offset: (params.page - 1) * 9,
      });
    }
  });
}

