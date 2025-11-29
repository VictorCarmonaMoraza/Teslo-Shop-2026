import { ProductCarousel } from '@/products/components/product-carousel/product-carousel';
import { Product } from '@/products/interfaces/product.interface';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabel } from "@/shared/components/form-error-label/form-error-label";
import { ProductsService } from '@/products/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
  //Inyectamos nuestro servicio de productos
  productService = inject(ProductsService);
  router = inject(Router);

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
    const isValid = this.productForm.valid;
    //Mostramos los errores de los inputs
    this.productForm.markAllAsTouched();
    //Mostramos datos del formulario
    console.log(this.productForm.value, { isValid })
    //Si el formulario no es valido, no hacemos nada
    if (!isValid) {
      return;
    }

    //Obtiene todos los valores actuales del formulario reactivo
    //formValue es un objeto con todas las propiedades definidas en productForm.
    const formValue = this.productForm.value;

    //Aquí construyes un objeto llamado productLike que representa
    //un producto parcial (no todos los campos son obligatorios).
    const productLike: Partial<Product> = {
      //Copia todas las propiedades del objeto formValue dentro de productLike
      ...(formValue as any),
      //formValue.tags?.toLowerCase()
      //Convierte la cadena a minúsculas (si existe):
      tags: formValue.tags?.toLowerCase()
        //Separa por comas → genera un array:
        .split(',')
        //Limpia espacios en blanco:
        //Si tags es null o undefined, colocas un array vacío.
        .map(tag => tag.trim()) ?? []
    };
    if (this.product().id === 'new') {
      //creamos el producto
      this.productService.createProduct(productLike).subscribe(
        product => {
          console.log('Producto creado');
          //Cuando se ha terminado de crear el producto se navega al producto creado
          this.router.navigate(['/admin/products', product.id]);
        }
      )

    } else {
      console.log(productLike);
      //LLamda al servicio para actualizar
      this.productService.updateProduct(this.product().id, productLike).subscribe(
        product => {
          console.log('Producto actualizado')
        });
    }
  }

  onSizeClicked(size: string) {
    //Obtenemos todas las tallas de listado de este producto
    //Si no viene nada lo mostramos como un string vacio
    const currentSizes = this.productForm.value.sizes ?? [];

    //Si en el listado de tallas se incluye la talla que hemos seleccionado
    if (currentSizes.includes(size)) {
      //Si la talla ya existe la quitamos
      currentSizes.splice(currentSizes.indexOf(size), 1);
      //Sin no esta la añadimos
    } else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes })


  }

}
