import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Error404Component } from './404/error-404.component';
import { Error500Component } from './500/error-500.component';
import { ErrorsRoutingModule } from './errors-routing.module';


@NgModule({
    declarations: [
        Error404Component,
        Error500Component
    ],
    imports     : [

        SharedModule,
        ErrorsRoutingModule
    ]
})
export class ErrorsModule
{
}