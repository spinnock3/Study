import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Course } from 'app/shared/models/course.model';
import { Exam } from 'app/shared/models/exam.model';
import { EditCourseDialogComponent } from '../dialogs/edit-course-dialog/edit-course-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CourseService } from 'app/shared/services/course.service';
import Swal from 'sweetalert2';
import * as moment from "moment";
import { Router } from '@angular/router';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { CalendarEventFormDialogComponent } from 'app/main/apps/calendar/event-form/event-form.component';
import { FormGroup } from '@angular/forms';
import { AddSetDialogComponent } from 'app/shared/dialogs/add-set-dialog/add-set-dialog.component';
import { AddExamDialogComponent } from 'app/shared/dialogs/add-exam-dialog/add-exam-dialog.component';
import { startOfDay } from 'date-fns';
import { StudySetService } from 'app/shared/services/study-set.service';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit, OnDestroy {
  user_id = localStorage.getItem('user_id');
  @Input() course: Course;
  Unsubscribe = new Subject();
  borderStyle;
  sets = [];
  exams = [];
  upcoming_exams;
  activeDayIsOpen: boolean;
  selectedDay: any;
  view: string;
  viewDate: Date;

  set_columns: string[] = ['name', 'cards', 'retention', 'action'];
  exam_columns: string[] = ['name', 'start', 'end', 'action'];

  constructor(private courseService: CourseService, private studySetService: StudySetService, public dialog: MatDialog, private router: Router, private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.selectedDay = { date: startOfDay(new Date()) };
    this.borderStyle = "15px solid " + this.course.color;

    
    this.calendarService.onEventsObs$
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(events => {
      if(events.filter(event => this.course.exams.includes(event._id))) {
        this.exams = events.filter(event => this.course.exams.find(exam_id => exam_id == event._id));
        this.getUpcomingExams();
      }
    })

  
    this.studySetService.onStudySetsObs$
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(sets => {
      if(sets.filter(set => this.course.study_sets.includes(set._id))) {
        this.sets = sets.filter(set => this.course.study_sets.find(set_id => set_id == set._id));

      }
    })
    

  }


  openEditDialog(course): void {
    const dialogRef = this.dialog.open(EditCourseDialogComponent, {
      width: '700px',
      data: course
    });

    dialogRef.componentInstance.onSubmit
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(course => {
        this.courseService.updateCourse(this.user_id, course)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe()
      })
  }

  addExam() {
    let exam_list = [];
    this.course.exams ? exam_list = this.course.exams : '';
    const dialogRef = this.dialog.open(AddExamDialogComponent, {
      data: { exam_list },
      width: '500px',
      height: '400px'
    });

    dialogRef.componentInstance.onSubmit
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(exam_id => {
        this.courseService.addExam(this.user_id, this.course._id, exam_id)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe(course => {
            this.course = course;
          })
      })
  }

  newExam() {
    const dialogRef = this.dialog.open(CalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data: {
        action: 'new',
        date: this.selectedDay.date,
        exam: true
      }
    });
    dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        const newEvent = response.getRawValue();
        this.calendarService.addEvent(this.user_id, newEvent)
          .pipe(takeUntil(this.Unsubscribe),
            mergeMap((exam) => {
              return this.courseService.addExam(this.user_id, this.course._id, exam._id)
            })).subscribe(course => {
              this.course = course;
            })
      })
  }

  addStudySet() {
    let set_list = [];
    this.course.study_sets ? set_list = this.course.study_sets : '';
    const dialogRef = this.dialog.open(AddSetDialogComponent, {
      data: { set_list },
      width: '500px',
      height: '400px'
    });

    dialogRef.componentInstance.onSubmit
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set_id => {
        this.courseService.addStudySet(this.user_id, this.course._id, set_id)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe(course => {
            this.course = course;
          })
      })
  }

  newStudySet() {
    this.router.navigate(['study-sets/study-set'], {
      queryParams: {
        _id: 'new',
        course_id: this.course._id
      }
    })
  }

  removeSet(set_id) {
    this.courseService.removeStudySet(this.user_id, this.course._id, set_id)
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(course => {
      this.course = course;
    })
  }

  removeExam(exam_id) {
    this.courseService.removeExam(this.user_id, this.course._id, exam_id)
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(course => {
      this.course = course;
    })
  }


  study(set_id) {
    this.studySetService.getStudySet(this.user_id, set_id);
    this.studySetService.onStudySetObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set => {
        this.router.navigate(['study-session'], {
          queryParams: {
            _id: set_id
          }
        })
      })
  }

  deleteCourse(_id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this course?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.courseService.deleteCourse(this.user_id, _id)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe(() => {

          })
      }
    })
  }

  getUpcomingExams() {
    let curr_date = moment();
    this.upcoming_exams = this.exams.filter(exam => {
      return moment(exam.end).isSameOrAfter(curr_date);
    })
  }

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }



}
