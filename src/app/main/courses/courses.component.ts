import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Course } from 'app/shared/models/course.model';
import { StudySetService } from 'app/shared/services/study-set.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CourseService } from '../../shared/services/course.service'
import { CalendarService } from '../apps/calendar/calendar.service';
import { AuthService } from '../auth/auth.service';
import { NewCourseDialogComponent } from './dialogs/new-course-dialog/new-course-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
  user_id = localStorage.getItem('user_id');
  courses: Course[];
  Unsubscribe = new Subject();

  constructor(private courseService: CourseService, public dialog: MatDialog, private studySetService: StudySetService, private calendarService: CalendarService) {

  }

  ngOnInit(): void {
    this.courseService.getCourses(this.user_id);

    this.courseService.onCoursesObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe((courses: Course[]) => {
        this.courses = courses;
      });
      this.calendarService.getEvents(this.user_id, true);
      this.studySetService.getStudySets(this.user_id);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(NewCourseDialogComponent, {
      width: '700px'
    });


    dialogRef.componentInstance.onSubmit
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(course_data => {
        this.courseService.addCourse(this.user_id, course_data)
        .pipe(takeUntil(this.Unsubscribe))
        .subscribe()
      })

  }

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }

}
