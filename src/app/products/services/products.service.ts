import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gender, Product, ProductsResponse } from '../interfaces/product.interface';
import { User } from '@/auth/interfaces/user.interface';


const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
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

    if (id === 'new') {
      return of(emptyProduct);
    }

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

  /**
   *
   * @param productLike
   * Actualiza un producto
   */
  updateProduct(id: string, productLike: Partial<Product>): Observable<Product> {
    console.log('Actualizando producto')
    //La actualizacion la harenmos mediante patch
    //PATCH suele usarse para actualizaciones parciales (envías solo los campos modificados).
    //baseUr: 'http://localhost:3000/api/products/hiopñ12jh44kl67hl'
    return this.http.patch<Product>(`${baseUrl}/products/${id}`, productLike)
      .pipe(
        //Ejecutamos un efecto secundario para que actualice la cache de product y de productos
        tap((product) => this.updateProductCache(product))
      )
  }

  //metodo para actualizar el cache
  updateProductCache(product: Product) {
    const productId = product.id;

    //Buscamos el id en la cache
    //Actualiza el primer cache
    this.productCache.set(productId, product);

    //Actualizar el segundo cache
    this.productsCache.forEach(productResponse => {
      productResponse.products = productResponse.products.map((currentProduct) => {
        return currentProduct.id === productId ? product : currentProduct
      })
    })

    console.log('Cache Actualizada');
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${baseUrl}/products`, productLike)
      .pipe(
        tap((product) => this.updateProductCache(product))
      );
  }


}
