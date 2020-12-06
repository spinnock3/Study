import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { FuseSharedModule } from '../../../@fuse/shared.module';

import { FaqComponent } from './faq.component';

import { AuthGuard } from '../auth/auth.guard'


const routes = [
    {
        path     : 'faq',
        component: FaqComponent,
        canActivate: [AuthGuard]
        /*resolve  : {
            faq: FaqService
        }*/
    }
];

@NgModule({
    declarations: [
        FaqComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatExpansionModule,
        MatIconModule,

        FuseSharedModule
    ],
    providers   : [
        //FaqService
    ]
})
export class FaqModule
{
}
