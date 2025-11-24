import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-page',
  imports: [],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage {

  //tomar la ruta activa
  activatedRoute = inject(ActivatedRoute);

  //Inyectamos el servicio de productos
  productService = inject(ProductsService);

  //Obtenemos el idSlug de la ruta
  productIdSlug: string = this.activatedRoute.snapshot.params['idSlug'];

  //Creamos el resource para el producto
  productResource = rxResource({
    params: () => ({ idSlug: this.productIdSlug }),
    stream: ({ params }) => {
      return this.productService.getProductBySlug(params.idSlug);
    }
  })
}
