import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from "../../../../environments/environment"
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { CalendarEventModel } from './event.model';
import { map } from 'rxjs/operators';
const BACKEND_URL = environment.apiURL + "/users/"

@Injectable()
export class CalendarService {
    event: CalendarEventModel;
    events: CalendarEventModel[] = [];

    private onEvents = new ReplaySubject<CalendarEventModel[]>(1);
    onEventsObs$ = this.onEvents.asObservable();

    onEvent = new ReplaySubject<CalendarEventModel>(1)
    onEventObs$ = this.onEvent.asObservable();


    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private http: HttpClient
    ) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get events
     *
     * @returns {Promise<any>}
     */
    getEvents(user_id: String, exams_only?) {
        var params = new HttpParams();

        if (exams_only) {
            params = params.set('exams_only', exams_only);
        }
        this.http.get(BACKEND_URL + user_id + '/events', { params })
            .subscribe((response: any) => {
                this.events = [...response.events];
                this.onEvents.next([...this.events]);
            })
    }

    addEvent(user_id: String, event) {
        return this.http.post(BACKEND_URL + user_id + '/events', event)
            .pipe(map((response: any) => {
                this.event = { ...response.event };
                this.onEvent.next(this.event);
                this.events.unshift(response.event);
                this.onEvents.next([...this.events])
                return this.event;
            }))
    }

    updateEvent(user_id: String, event) {
        return this.http.put(BACKEND_URL + user_id + '/events/' + event._id, event)
            .pipe(map((response: any) => {
                this.event = { ...response.event };
                this.events[this.events.findIndex(event => event._id === response.event._id)] = response.event;
                this.onEvent.next(this.event);
                this.onEvents.next([...this.events]);
                return this.event;
            }))
    }

    /**
     * PUT
     * @param set_id 
     * @param exam_id 
     */
    addStudySet(user_id: string, exam_id: string, set_id: string) {
        return this.http.put(BACKEND_URL + user_id + '/events/' + exam_id + '/study-sets', { study_set_id: set_id })
            .pipe(map((response: any) => {
                this.events[this.events.findIndex(exam => exam._id === response.event._id)] = response.event
                this.onEvents.next([...this.events]);
                return response.event;
            }));
    }

    /**
     * PUT
     * @param set_id 
     * @param exam_id 
     */
    removeStudySet(user_id: string, exam_id: string, set_id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/events/' + exam_id + '/study-sets/'+set_id)
            .pipe(map((response: any) => {
                this.events[this.events.findIndex(exam => exam._id === response.event._id)] = response.event
                this.onEvents.next([...this.events]);
                return response.event;
            }));
    }


    deleteEvent(user_id: string, _id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/events/' + _id, { observe: 'response' })
            .pipe(map((response: any) => {
                this.events = this.events.filter(event => event._id !== _id);
                this.onEvents.next([...this.events]);
                return response.status;
            }));
    }


}
