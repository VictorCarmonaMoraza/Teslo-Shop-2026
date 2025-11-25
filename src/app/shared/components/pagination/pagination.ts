import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  //Numero de paginas que se las pasa desde el componente padre
  pages = input(0);
  //Pagina actual en la que estamos
  currentPage = input<number>(1);
  // linkedSignal sincroniza activePage con currentPage (dos direcciones)
  activePage = linkedSignal(this.currentPage);

  // Genera un array [1, 2, 3, ..., pages]
  getPagesList = computed(() => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  });

}
