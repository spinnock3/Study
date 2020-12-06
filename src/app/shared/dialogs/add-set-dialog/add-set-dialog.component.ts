import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudySetService } from 'app/shared/services/study-set.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-set-dialog',
  templateUrl: './add-set-dialog.component.html',
  styleUrls: ['./add-set-dialog.component.scss']
})
export class AddSetDialogComponent implements OnInit, OnDestroy {

  user_id = localStorage.getItem('user_id');
  study_sets;
  Unsubscribe = new Subject();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form = new FormGroup({
    set_id: new FormControl('', [Validators.required]),
  });

  constructor(
    private studySetService: StudySetService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddSetDialogComponent>
  ) { }

  ngOnInit(): void {
    this.studySetService.getStudySets(this.user_id);
    this.studySetService.onStudySetsObs$
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(sets => {
      this.study_sets = sets;
      if(this.data.set_list) {
        this.study_sets = this.study_sets.filter(set => !this.data.set_list.find(el => el === set._id))
      }
    })
  }

  sendForm() {
    this.onSubmit.emit(this.form.get('set_id').value);
  }

  ngOnDestroy() {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }

}
