import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Course } from 'app/shared/models/course.model';

@Component({
  selector: 'app-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.scss']
})
export class NewCourseDialogComponent implements OnInit {

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  semesters = ['Fall', 'Spring', 'Summer'];
  years = [];

  colors = ["#16a085", "#ff6e7f", "#2b5876", "#cc2b5e"]



  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    semester: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<NewCourseDialogComponent>
  ) { }

  ngOnInit() {
    for (var i = 1; i < 5; i++) {
      this.years.push(moment().subtract(i, 'year').year());
    }
    for (var i = 0; i < 5; i++) {
      this.years.push(moment().add(i, 'year').year());
    }
    this.years.sort((a, b) => a - b);
  }

  setColor(color) {
    this.form.get("color").patchValue(color);
  }


  sendForm() {
    let course: Course = {
      name: this.form.get('name').value,
      color: this.form.get('color').value,
      term: {
        semester: this.form.get('semester').value,
        year: this.form.get('year').value
      }
    };


    this.onSubmit.emit(course);
  }

}
