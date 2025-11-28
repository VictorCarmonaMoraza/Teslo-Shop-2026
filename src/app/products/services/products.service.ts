import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product, ProductsResponse } from '../interfaces/product.interface';


const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {

  private http = inject(HttpClient);
  private productsCache = new Map<string, ProductsResponse>();

  private productCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    console.log(this.productsCache.entries());

    const key = `${limit}-${offset}-${gender}`;  // 9-0-''

    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!);
    }

    return this.http.get<ProductsResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
      .pipe(
        tap(resp => console.log('ProductsResponse', resp)),
        tap(resp => this.productsCache.set(key, resp))
      );
  }

  //Metodo para obtener producto por slug
  getProductBySlug(idSlug: string): Observable<Product> {

    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(
        delay(2000),
        tap(resp => console.log('getProductBySlug', resp)),
        tap(resp => this.productCache.set(idSlug, resp))
      );
  }


  //Metodo para obtener producto por slug
  getProductById(id: string): Observable<Product> {

    if (this.productCache.has(id)) {
      return of(this.productCache.get(id)!);
    }

    return this.http.get<Product>(`${baseUrl}/products/${id}`)
      .pipe(
        delay(2000),
        tap(resp => console.log('getProductBySlug', resp)),
        tap(resp => this.productCache.set(id, resp))
      );
  }

  updateProduct(productLike: Partial<Product>) {
    console.log('Actualizando producto')
  }

}
