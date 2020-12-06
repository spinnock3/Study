import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudySessionComponent } from './study-session.component';
import { AuthGuard } from '../auth/auth.guard'

const routes = [

    {
        path: 'study-session',
        component: StudySessionComponent,
        canActivate: [AuthGuard]
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class StudySessionRoutingModule { }
