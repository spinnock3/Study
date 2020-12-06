import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Error404Component } from './404/error-404.component'
import { Error500Component } from './500/error-500.component'

const routes = [
    {
        path: 'errors/error-404',
        component: Error404Component
    },
    {
        path: 'errors/error-500',
        component: Error500Component
    },
    { 
        path: '**', 
        redirectTo: 'errors/error-404',
        pathMatch: 'full' 
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class ErrorsRoutingModule { }
