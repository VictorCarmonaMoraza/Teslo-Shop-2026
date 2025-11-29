import { Component, inject, signal } from '@angular/core';
import { ProductTable } from "@/products/components/product-table/product-table";
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { ProductsService } from '@/products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pagination } from "@/shared/components/pagination/pagination";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html',
  styleUrl: './products-admin-page.css',
})
export class ProductsAdminPage {
  paginationService = inject(PaginationService);

  //Inyectamos el servicio de productos
  private productsService = inject(ProductsService);

  //Creamos un nueva señal para pasar los productos que queremos por pagina
  productsPerPage = signal(10);


  productsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage(),
      limit: this.productsPerPage()
    }),
    // stream() define cómo obtener los datos en función de los parámetros.
    // Aquí realizamos la petición HTTP al backend.
    stream: ({ params }) => {
      return this.productsService.getProducts({
        offset: (params.page - 1) * params.limit,
        limit: params.limit
      });
    }
  });
}
