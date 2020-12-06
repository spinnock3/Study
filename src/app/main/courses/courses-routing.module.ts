import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursesComponent } from './courses.component';
import { AuthGuard } from '../auth/auth.guard'

const routes = [

    {
        path: 'courses',
        component: CoursesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: 'courses',
        pathMatch: 'full'
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class CoursesRoutingModule { }
