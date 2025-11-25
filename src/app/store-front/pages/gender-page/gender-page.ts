import { ProductCard } from "@/products/components/product-card/product-card";
import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard],
  templateUrl: './gender-page.html',
  styleUrl: './gender-page.css',
})
export class GenderPage {

  route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  gender = toSignal(this.route.params.pipe(
    map(({ gender }) => gender)
  ))

  productsResource = rxResource({
    params: () => ({ gender: this.gender() }),
    stream: ({ params }) => {
      return this.productsService.getProducts({ gender: params.gender });
    }
  });

}
