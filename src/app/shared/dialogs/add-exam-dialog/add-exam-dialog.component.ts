import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CalendarService } from '../../../main/apps/calendar/calendar.service';

@Component({
  selector: 'app-add-exam-dialog',
  templateUrl: './add-exam-dialog.component.html',
  styleUrls: ['./add-exam-dialog.component.scss']
})
export class AddExamDialogComponent implements OnInit, OnDestroy {

  user_id = localStorage.getItem('user_id');
  exams;
  Unsubscribe = new Subject();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form = new FormGroup({
    exam_id: new FormControl('', [Validators.required]),
  });

  constructor(
    private calendarService: CalendarService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddExamDialogComponent>
  ) { }

  ngOnInit(): void {
    this.calendarService.getEvents(this.user_id, true);
    this.calendarService.onEventsObs$
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(exams => {
      this.exams = exams;
      if(this.data.exam_list) {
        this.exams = this.exams.filter(exam => !this.data.exam_list.find(el => el === exam._id))
      }
    })
  }

  sendForm() {
    this.onSubmit.emit(this.form.get('exam_id').value);
  }

  ngOnDestroy() {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }

}
