import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "src/environments/environment";


const baseUrl = environment.baseUrl;

@Pipe({
  name: "productImage",
})

export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[]): string {
    //si es un string devolvemos el mismo valor
    if (typeof value === "string") {
      return `${baseUrl}/files/product/${value}`;
    }
    // 2. Si value no existe o no es un array o está vacío → devolvemos placeholder
    if (!value || !Array.isArray(value) || value.length === 0) {
      return "assets/images/no-image.jpg"; // sin "./"
    }
    return `${baseUrl}/files/product/${value[0]}`;
  }
}
