import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Course } from '../models/course.model';
import { environment } from "../../../environments/environment"
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Exam } from '../models/exam.model';

const BACKEND_URL = environment.apiURL + "/users/"


@Injectable({ providedIn: 'root' })
export class CourseService {
    course: Course;
    courses: Course[] = [];

    private onCourses = new ReplaySubject<Course[]>(1);
    onCoursesObs$ = this.onCourses.asObservable();

    onCourse = new ReplaySubject<Course>(1)
    onCourseObs$ = this.onCourse.asObservable();


    constructor(private http: HttpClient, private router: Router) {
    }



    /**
    * GET
    * @param user_id 
    */
    getCourses(user_id: string) {
        var params = new HttpParams();

        this.http.get(BACKEND_URL + user_id + '/courses', { params })
            .subscribe((response: any) => {
                this.courses = [...response.courses];
                this.onCourses.next([...this.courses]);
            })
    }

    /**
    * GET
    * @param user_id 
    * @param course_id
    */
    getCourse(user_id: string, course_id: string) {
        this.http.get(BACKEND_URL + user_id + '/courses/' + course_id)
            .subscribe((response: any) => {
                this.course = response.course;
                this.onCourse.next(this.course);
            })
    }

    /**
     * POST
     * @param user_id 
     * @param course 
     */
    addCourse(user_id: string, course: Course) {
        return this.http.post(BACKEND_URL + user_id + '/courses', course)
            .pipe(map((response: any) => {
                this.courses.unshift(response.course);
                this.onCourses.next([...this.courses])
                return response.course;
            }));
    }

    /**
     * PUT
     * @param user_id 
     * @param course 
     */
    updateCourse(user_id: string, course: Course) {
        return this.http.put(BACKEND_URL + user_id + '/courses/' + course._id, course)
            .pipe(map((response: any) => {
                this.courses[this.courses.findIndex(course => course._id === response.course._id)] = response.course
                this.onCourses.next([...this.courses]);
                return response.course;
            }));
    }


    /**
     * PUT
     * @param exam 
     * @param course_id 
     */
    addExam(user_id: string, course_id: string, exam_id) {
        return this.http.put(BACKEND_URL + user_id + '/courses/' + course_id + '/exams', {exam_id: exam_id})
            .pipe(map((response: any) => {
                this.courses[this.courses.findIndex(course => course._id === response.course._id)] = response.course
                this.onCourses.next([...this.courses]);
                this.course = response.course;
                this.onCourse.next(response.course);
                return response.course;
            }));
    }

    /**
     * PUT
     * @param set_id 
     * @param course_id 
     */
    addStudySet(user_id: string, course_id: string, set_id: string) {
        return this.http.put(BACKEND_URL + user_id + '/courses/' + course_id + '/study-sets', {study_set_id: set_id})
            .pipe(map((response: any) => {
                this.courses[this.courses.findIndex(course => course._id === response.course._id)] = response.course
                this.onCourses.next([...this.courses]);
                return response.course;
            }));
    }

    /**
     * PUT
     * @param user_id 
     * @param course_id 
     * @param set_id
     */
    removeStudySet(user_id: string, course_id: string, set_id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/courses/' + course_id + '/study-sets/'+set_id)
            .pipe(map((response: any) => {
                this.courses[this.courses.findIndex(course => course._id === response.course._id)] = response.course
                this.onCourses.next([...this.courses]);
                return response.course;
            }));
    }

    /**
     * PUT
     * @param user_id 
     * @param course_id 
     * @param exam_id 
     */
    removeExam(user_id: string, course_id: string, exam_id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/courses/' + course_id + '/exams/'+exam_id)
            .pipe(map((response: any) => {
                this.courses[this.courses.findIndex(course => course._id === response.course._id)] = response.course
                this.onCourses.next([...this.courses]);
                return response.course
            }));
    }

    /**
     * DELETE
     * @param user_id 
     * @param _id 
     */
    deleteCourse(user_id: string, _id: string) {
        return this.http.delete(BACKEND_URL + user_id + '/courses/' + _id, { observe: 'response' })
            .pipe(map((response: any) => {
                this.courses = this.courses.filter(course => course._id !== _id);
                this.onCourses.next([...this.courses]);
                return response.status;
            }));
    }

}

