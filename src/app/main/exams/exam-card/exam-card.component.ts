import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Course } from 'app/shared/models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Exam } from 'app/shared/models/exam.model';
import Swal from 'sweetalert2';
import { CalendarEventModel } from 'app/main/apps/calendar/event.model';
import { CalendarService } from '../../apps/calendar/calendar.service';
import { CalendarEventFormDialogComponent } from '../../apps/calendar/event-form/event-form.component';
import { FormGroup } from '@angular/forms';
import { AddSetDialogComponent } from 'app/shared/dialogs/add-set-dialog/add-set-dialog.component';
import { Router } from '@angular/router';
import { StudySetService } from 'app/shared/services/study-set.service';

@Component({
  selector: 'app-exam-card',
  templateUrl: './exam-card.component.html',
  styleUrls: ['./exam-card.component.scss']
})
export class ExamCardComponent implements OnInit, OnDestroy {

  user_id = localStorage.getItem('user_id');
  @Input() exam: CalendarEventModel;
  Unsubscribe = new Subject();
  borderStyle;
  dialogRef;
  sets = [];
  dataSource
  displayedColumns: string[] = ['name', 'cards', 'retention', 'action'];
  constructor(private calendarService: CalendarService, private studySetService: StudySetService, public dialog: MatDialog, private router: Router) { }

  ngOnInit(): void {
    this.borderStyle = "15px solid " + this.exam.color.primary;
    this.studySetService.onStudySetsObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(sets => {
        if (this.exam && this.exam.exam_data) {
          this.sets = sets.filter(set => this.exam.exam_data.study_sets.includes(set._id));
          this.dataSource = this.sets;
        }

      })
  }


  openEditDialog(exam): void {
    this.dialogRef = this.dialog.open(CalendarEventFormDialogComponent, {
      panelClass: 'event-form-dialog',
      data: {
        event: exam,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
        const actionType: string = response[0];
        const formData: FormGroup = response[1];
        switch (actionType) {
          /**
           * Save
           */
          case 'save':
            exam = { ...exam, ...formData.value };
            this.calendarService.updateEvent(this.user_id, exam)
              .pipe(takeUntil(this.Unsubscribe))
              .subscribe();
            break;
          /**
           * Delete
           */
          case 'delete':

            this.calendarService.deleteEvent(this.user_id, exam._id)
              .pipe(takeUntil(this.Unsubscribe))
              .subscribe();

            break;
        }
      });
  }



  deleteExam(_id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this exam?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      this.calendarService.deleteEvent(this.user_id, _id)
        .pipe(takeUntil(this.Unsubscribe))
        .subscribe(() => {
        })
    })
  }

  newSet() {
    this.router.navigate(['study-sets/study-set'], {
      queryParams: {
        _id: 'new',
        exam_id: this.exam._id
      }
    })
  }

  addSet() {
    let set_list = [];
    this.exam.exam_data && this.exam.exam_data.study_sets ? set_list = this.exam.exam_data.study_sets : '';
    const dialogRef = this.dialog.open(AddSetDialogComponent, {
      data: { set_list },
      width: '500px',
      height: '400px'
    });

    dialogRef.componentInstance.onSubmit
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set_id => {
        this.calendarService.addStudySet(this.user_id, this.exam._id, set_id)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe(exam => {
            this.exam = exam;
          })
      })
  }

  removeSet(set_id) {
    this.calendarService.removeStudySet(this.user_id, this.exam._id, set_id)
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(exam => {
      this.exam = exam;
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


  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }



}
