import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '../../../../@fuse/services/config.service';
import { fuseAnimations } from '../../../../@fuse/animations';
import { AuthService } from '../auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    private Unsubscribe = new Subject();
    loginForm: FormGroup;
    returnUrl: string;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // get return url from route parameters or default to '/'
        let returnU = this.route.snapshot.queryParams['returnUrl'.toString()];

        returnU != '' ? this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/' : null;

        this.authService.isLoggedIn() ? this.router.navigate([this.returnUrl]) : '';
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    login() {
        this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
            .pipe(takeUntil(this.Unsubscribe))
            .subscribe(() => this.router.navigate([this.returnUrl]), err => {})
    }

    ngOnDestroy() {
        this.Unsubscribe.next();
        this.Unsubscribe.complete();
    }
}
