import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
  styleUrl: './product-admin-page.css',
})
export class ProductAdminPage {

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductsService);

  //Este fragmento convierte los parámetros de la ruta en una Signal de Angular.
  productId = toSignal(
    // es un Observable que emite los parámetros dinámicos de la ruta.
    this.activatedRoute.params
      //Usamos map() para transformar el objeto de parámetros y quedarnos solo con el parámetro id.
      .pipe(map(params => params['id']))
  )

  //Traer la data del producto con el Id
  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this.productService.getProductById(params.id);
    }
  })

  //si borramos algun numero o letras del id del producto de la url no manda a la url de productos
  redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this.router.navigate(['/admin/products'])
    }
  })
}
