import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { Product } from '@/products/interfaces/product.interface';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarousel],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  //Para mostrar el producto que le pasamos por el input
  product = input.required<Product>();

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
}
