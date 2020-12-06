import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable, ReplaySubject, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../../environments/environment"
//import { UserModel } from "../_models/user.model"
import * as moment from 'moment';
import { Router } from '@angular/router';


const BACKEND_URL = environment.apiURL + "/";
const BACKEND_USER_URL = environment.apiURL + "/users/";

@Injectable({ providedIn: 'root' })
export class AuthService {
    public user;
    private users = [];

    onUsers = new ReplaySubject(1);
    onUsers$ = this.onUsers.asObservable();

    currentUserSubject = new BehaviorSubject(undefined);
    currentUser$ = this.currentUserSubject.asObservable();

    private timer: NodeJS.Timer;


    constructor(private http: HttpClient, private router: Router) {

    }

    register(user) {
        return this.http.post(BACKEND_URL + 'register', user)
            .pipe(map((response: any) => {
                this.user = response.user;
                return this.user;
            }));
    }

    login(email, password) {
        return this.http.post(BACKEND_URL + 'login', { email, password })
            .pipe(map((response: any) => {
                this.user = response.user;
                this.setSession(response);
                this.setAuthTimer(response.expiresIn);
                return;
            }));
    }

    private setSession(authResp) {
        const expiresAt = moment().add(authResp.expiresIn, 'second');

        localStorage.setItem('id_token', authResp.idToken);
        localStorage.setItem('user_id', authResp.user.user_id);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));

        localStorage.setItem('email', authResp.user.email);
        localStorage.setItem('name', authResp.user.name);
        localStorage.setItem('profile_color', authResp.user.profile_color);
        localStorage.setItem('points', authResp.user.points);
        localStorage.setItem('user_roles', authResp.user.user_roles);

        this.currentUserSubject.next(authResp.user)
    }

    refreshAuth() {
        return this.http.get(BACKEND_URL + 'refreshAuth')
            .pipe(map((response: any) => {
                this.setSession(response);
                this.setAuthTimer(response.expiresIn);
                return response;
            }))
    }

    getCurrentUser(user_id) {
        console.log("WHY")
        return this.http.get(BACKEND_USER_URL + user_id)
        .pipe(map((response: any) => {
            this.user = response.user;
            this.currentUserSubject.next(this.user);
            return this.user;
        }));
    }


    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("user_id");
        this.router.navigate(['/auth/login'], {
            queryParams: {},
        });
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }


    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return expiresAt;
    }

    setAuthTimer(duration: number) {
        //Clear the old timeout first
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if (!this.isLoggedIn()) {
                this.logout();
            }
        }, duration * 1000);
    }

    forgotPassword() {
        return;
    }

    saveAuthData(user) {
        //localStorage.setItem('expiration', expirationDate.toISOString());
    }

}

