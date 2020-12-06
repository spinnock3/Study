import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudySetsComponent } from './study-sets.component';
import { StudySetComponent } from './study-set/study-set.component';
import { AuthGuard } from '../auth/auth.guard'
import { SetListComponent } from './set-list/set-list.component';

const routes = [

    {
        path: 'study-sets',
        component: StudySetsComponent,
        canActivate: [AuthGuard],
        children: [
                {
                  path: '',
                  redirectTo: 'set-list',
                  pathMatch: 'full'
                },
                 
                {
                  path: 'set-list',
                  component: SetListComponent
                },    
                {
                  path     : 'study-set',
                  component: StudySetComponent
                },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class StudySetsRoutingModule { }
