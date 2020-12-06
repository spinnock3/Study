import { Component, OnInit, Output, EventEmitter, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-course-dialog',
  templateUrl: './edit-course-dialog.component.html',
  styleUrls: ['./edit-course-dialog.component.scss']
})
export class EditCourseDialogComponent implements OnInit {
  semesters = ['Fall', 'Spring', 'Summer'];
  years = [];


  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  colors = ["#16a085", "#ff6e7f", "#2b5876", "#cc2b5e"];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EditCourseDialogComponent>
  ) {
    this.form = new FormGroup({
      name: new FormControl(this.data.name, [Validators.required, Validators.maxLength(200)]),
      semester: new FormControl(this.data.term.semester, [Validators.required]),
      year: new FormControl(this.data.term.year, [Validators.required]),
      color: new FormControl(this.data.color, [Validators.required]),
    });
  }

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
    let course = this.data;
    course.name = this.form.get('name').value;
    course.color = this.form.get('color').value;
    course.term = {
      semester: this.form.get('semester').value,
      year: this.form.get('year').value
    }

    this.onSubmit.emit(course);
  }

}
