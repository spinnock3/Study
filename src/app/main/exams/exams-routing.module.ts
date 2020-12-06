import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamsComponent } from './exams.component';
import { AuthGuard } from '../auth/auth.guard'

const routes = [

    {
        path: 'exams',
        component: ExamsComponent,
        canActivate: [AuthGuard]
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class ExamsRoutingModule { }
