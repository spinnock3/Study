import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { Exam } from 'app/shared/models/exam.model';
import { StudySetService } from 'app/shared/services/study-set.service';
import { startOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarService } from '../apps/calendar/calendar.service';
import { CalendarEventFormDialogComponent } from '../apps/calendar/event-form/event-form.component';
import { CalendarEventModel } from '../apps/calendar/event.model';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {
  user_id = localStorage.getItem('user_id');
  exams: CalendarEventModel[];
  Unsubscribe = new Subject();
  dialogRef: any;
  selectedDay: any;


  constructor(public dialog: MatDialog, private _calendarService: CalendarService, private studySetService: StudySetService) {
  }

  ngOnInit(): void {
    // Set the defaults
    this.selectedDay = { date: startOfDay(new Date()) };

    this._calendarService.getEvents(this.user_id, true);
    this.studySetService.getStudySets(this.user_id);

    this._calendarService.onEventsObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe((events: CalendarEventModel[]) => {
        this.exams = events;
      });
  }


  /**
   * Add Event
   */
  addExam(): void {
      this.dialogRef = this.dialog.open(CalendarEventFormDialogComponent, {
          panelClass: 'event-form-dialog',
          data: {
              action: 'new',
              date: this.selectedDay.date,
              exam: true
          }
      });
      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if (!response) {
                  return;
              }
              const newEvent = response.getRawValue();
              this._calendarService.addEvent(this.user_id, newEvent)
                  .pipe(takeUntil(this.Unsubscribe))
                  .subscribe(event => {
                  })

          });
  }

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }

}
