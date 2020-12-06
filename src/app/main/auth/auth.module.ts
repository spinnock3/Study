import { NgModule } from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import {ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
    imports: [
        AuthRoutingModule,
        SharedModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        LockComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent
    ],
    exports: [
       
    ],
    providers: [
    ],
})
export class AuthModule { }
