import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { Product } from '@/products/interfaces/product.interface';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarousel, ReactiveFormsModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  //Para mostrar el producto que le pasamos por el input
  product = input.required<Product>();

  //Inyecciones
  fb = inject(FormBuilder);

  //Variables
  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  //Creamos un formulario reactivo
  productForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  })

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  //Este método sirve para llenar un formulario (productForm) con los valores de un producto.
  setFormValue(formLike: Partial<Product>) {
    //Hace lo mismo que la siguiente linea
    //this.productForm.patchValue(formLike as any);
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(',') })
  }

  onSubmit() {
    //Mostramos datos del formulario
    console.table(this.productForm.value)
  }

  onSizeClicked(size: string) {
    //Obtenemos todas las tallas de listado de este producto
    //Si no viene nada lo mostramos como un string vacio
    const currentSizes = this.productForm.value.sizes ?? [];

    //Si en el listado de tallas se incluye la talla que hemos seleccionado
    if (currentSizes.includes(size)) {
      //Si la talla ya existe la quitamos
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes })


  }

}
