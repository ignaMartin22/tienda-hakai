import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/catalogo/catalogo.component').then(m => m.CatalogoComponent)
  },
  {
    path: 'productos/:id',
    loadComponent: () => import('./features/producto/producto.component').then(m => m.ProductoComponent)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./features/carrito/carrito.component').then(m => m.CarritoComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'contacto',
    loadComponent:() => import('./features/info/contacto/contacto.component').then(m => m.ContactoComponent)
  },
  {
  path: 'politica-devoluciones',
  loadComponent: () => import('./features/info/politica/politica.component').then(m => m.PoliticaComponent)
},
{
  path: 'como-comprar',
  loadComponent: () => import('./features/info/como-comprar/como-comprar.component').then(m => m.ComoComprarComponent)
},
{
  path: 'quienes-somos',
  loadComponent: () => import('./features/info/quienes-somos/quienes-somos.component').then(m => m.QuienesSomosComponent)
},
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'productos',
        loadComponent: () => import('./features/admin/productos/productos.component').then(m => m.ProductosComponent)
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/admin/categorias/categorias.component').then(m => m.CategoriasComponent)
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./features/admin/pedidos/pedidos.component').then(m => m.PedidosComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];