import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'productos',
        loadChildren: () => import('../productos/productos.module').then(m => m.ProductosPageModule)
      },
      {
        path: 'galeria',
        loadChildren: () => import('../galeria/galeria.module').then(m => m.GaleriaPageModule)
      },
      {
        path: 'about-us',
        loadChildren: () => import('../about-us/about-us.module').then(m => m.AboutUsPageModule)
      },
      {
        path: 'tiendas',
        loadChildren: () => import('../tiendas/tiendas.module').then(m => m.TiendasPageModule)
      },
      {
        path: 'detalle', // Agrega la página de detalle como una ruta hija
        loadChildren: () => import('../detalle/detalle.module').then(m => m.DetallePageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/productos',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/productos',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
