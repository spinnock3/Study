import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../auth/auth.guard'

const routes = [

    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full' 
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }