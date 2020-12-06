import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpResponse, HttpEvent } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from './main/auth/auth.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor
        (
            private router: Router,
            private authService: AuthService,
            private toastr: ToastrService

        ) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem("id_token");
        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned)
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        let errorMessage = "An unknown error has occurred"
                        if (error.status === 401 && this.router.url !== '/login') {
                            this.router.navigate(['/auth/login']);
                            /*this.toastr.warning('Please log in again to continue using this application', 'You have been logged out', {
                                closeButton: true,
                                disableTimeOut: true
                            });*/
                        }
                        //Connection refused, connection timed out, etc.
                        if (error.status === 0) {
                            this.toastr.error('Please reload the page and try again. If the issue persists, please contact the website administrator.', 'Connection Lost', {
                                closeButton: true,
                                disableTimeOut: true
                            });
                        }
                        else if (error.error && error.error.message) {
                            errorMessage = error.error.message;
                            this.toastr.error(errorMessage, 'An Error has Occured', {
                                closeButton: true,
                                disableTimeOut: true
                            });
                            return throwError(error);

                        }
                        else {
                            this.toastr.error('An Unknown Error has Occured. Please contact the website administrator.', 'An Unknown Error has Occured', {
                                closeButton: true,
                                disableTimeOut: true
                            });
                            return throwError(error);
                        }

                    })
                );

        }
        else {
            return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = "An unknown error has occurred"
                    if (error.status === 401 && this.router.url !== '/login') {
                        this.router.navigate(['/auth/login']);
                       /* this.toastr.warning('Please log in again to continue using this application', 'You have been logged out', {
                            closeButton: true,
                            disableTimeOut: true
                        });*/
                    }
                    //Connection refused, connection timed out, etc.
                    if (error.status === 0) {
                        this.toastr.error('Please reload the page and try again. If the issue persists, please contact the website administrator.', 'Connection Lost', {
                            closeButton: true,
                            disableTimeOut: true
                        });
                    }
                    else if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                        this.toastr.error(errorMessage, 'An Error has Occured', {
                            closeButton: true,
                            disableTimeOut: true
                        });
                        return throwError(error);

                    }
                    else {
                        this.toastr.error('An Unknown Error has Occured. Please contact the website administrator.', 'An Unknown Error has Occured', {
                            closeButton: true,
                            disableTimeOut: true
                        });
                        return throwError(error);
                    }

                })
            );
        }
    }
}
