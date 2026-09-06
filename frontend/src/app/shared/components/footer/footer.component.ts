import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private router: Router) { }

  navegar(ruta: string): void{
    this.router.navigate([ruta]).then(() => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    });
  }

}
