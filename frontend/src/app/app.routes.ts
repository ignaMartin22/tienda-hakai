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