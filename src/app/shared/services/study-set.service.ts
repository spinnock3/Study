import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from "../../../environments/environment"
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StudySet } from '../models/study-set.model';

const BACKEND_URL = environment.apiURL + "/users/"


@Injectable({ providedIn: 'root' })
export class StudySetService {
    studySet: StudySet;
    studySets: StudySet[] = [];

    private onStudySets = new ReplaySubject<StudySet[]>(1);
    onStudySetsObs$ = this.onStudySets.asObservable();

    onStudySet = new ReplaySubject<StudySet>(1)
    onStudySetObs$ = this.onStudySet.asObservable();


    constructor(private http: HttpClient, private router: Router) {
    }



    /**
    * GET
    * @param user_id 
    */
    getStudySets(user_id: string, exam_id?, course_id?) {
        var params = new HttpParams();
        if (exam_id) {
            params = params.set('exam_id', exam_id);
        }
        if (course_id) {
            params = params.set('course_id', course_id);
        }
        
        this.http.get(BACKEND_URL + user_id + '/study-sets', { params })
            .subscribe((response: any) => {
                this.studySets = [...response.study_sets];
                this.onStudySets.next([...this.studySets]);
            })
    }

    /**
    * GET
    * @param user_id 
    * @param set_id
    */
    getStudySet(user_id: string, set_id: string) {

        var params = new HttpParams();

        this.http.get(BACKEND_URL + user_id + '/study-sets/' + set_id, { params })
            .subscribe((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
            })
    }

    /**
     * POST
     * @param user_id 
     * @param set 
     */
    addStudySet(user_id: string, set: StudySet) {
        return this.http.post(BACKEND_URL + user_id + '/study-sets', set)
            .pipe(map((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
                this.studySets.unshift(response.study_set);
                this.onStudySets.next([...this.studySets])
                return response.study_set;
            }));
    }

    /**
     * PUT
     * @param user_id 
     * @param studySet 
     */
    updateStudySet(user_id: string, set: StudySet) {
        return this.http.put(BACKEND_URL + user_id + '/study-sets/' + set._id, set)
            .pipe(map((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
                this.studySets[this.studySets.findIndex(set => set._id === response.study_set._id)] = response.study_set
                this.onStudySets.next([...this.studySets]);
                return response.study_set;
            }));
    }


    /**
     * DELETE
     * @param user_id 
     * @param _id 
     */
    deleteStudySet(user_id: string, _id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/study-sets/' + _id, { observe: 'response' })
            .pipe(map((response: any) => {
                this.studySets = this.studySets.filter(set => set._id !== _id);
                this.onStudySets.next([...this.studySets]);
                return response.status;
            }));
    }



    /***************************/
    /********** Cards **********/
    /***************************/


    /**
     * POST
     * @param user_id 
     * @param set 
     */
    addCards(user_id: string, set_id: string, cards: []) {
        return this.http.post(BACKEND_URL + user_id + '/study-sets' + set_id + "/cards/", cards)
            .pipe(map((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
                this.studySets[this.studySets.findIndex(set => set._id === response.study_set._id)] = response.study_set
                this.onStudySets.next([...this.studySets]);
                return response.study_set;
            }));
    }

    /**
     * PUT
     * @param user_id 
     * @param studySet 
     */
    editCard(user_id: string, set_id: string, card) {
        return this.http.put(BACKEND_URL + user_id + '/study-sets/' + set_id + "/cards/" + card._id, card)
            .pipe(map((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
                this.studySets[this.studySets.findIndex(set => set._id === response.study_set._id)] = response.study_set
                this.onStudySets.next([...this.studySets]);
                return response.study_set;
            }));
    }

    updateRetention(user_id: string, set_id, card_id, answer_correct) {
        return this.http.put(BACKEND_URL + user_id + '/study-sets/' + set_id + "/cards/" + card_id + '/retention', { answer_correct })
            .pipe(map((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
                this.studySets[this.studySets.findIndex(set => set._id === response.study_set._id)] = response.study_set
                this.onStudySets.next([...this.studySets]);
                return response.study_set;
            }));
    }


    /**
     * DELETE
     * @param user_id 
     * @param _id 
     */
    deleteCard(user_id: string, set_id: string, card_id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/study-sets/' + set_id + "/cards/" + card_id)
            .pipe(map((response: any) => {
                this.studySet = response.study_set;
                this.onStudySet.next(this.studySet);
                this.studySets[this.studySets.findIndex(set => set._id === response.study_set._id)] = response.study_set;
                this.onStudySets.next([...this.studySets]);
                return response.study_set;
            }));
    }

}

