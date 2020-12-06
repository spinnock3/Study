import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudySetService } from 'app/shared/services/study-set.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-card',
  templateUrl: './set-card.component.html',
  styleUrls: ['./set-card.component.scss']
})
export class SetCardComponent implements OnInit, OnDestroy {
  Unsubscribe = new Subject();
  user_id = localStorage.getItem('user_id');
  @Input() set;


  constructor(private studySetService: StudySetService, private router: Router) { }

  ngOnInit(): void {
  }

  onSelectSet(_id) {
    this.studySetService.getStudySet(this.user_id, _id);
    this.studySetService.onStudySetObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set => {
        this.router.navigate(['study-sets/study-set'], {
          queryParams: {
            _id: this.set._id
          }
        })
      })
  }

  studySet() {
    this.studySetService.getStudySet(this.user_id, this.set._id);
    this.studySetService.onStudySetObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set => {
        this.router.navigate(['study-session'], {
          queryParams: {
            _id: this.set._id
          }
        })
      })
  }

  editSet() {
    this.router.navigate(['study-sets/study-set'], {
      queryParams: {
        _id: this.set._id,
        edit: true
      }
    })
  }

  deleteSet() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this study set?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.studySetService.deleteStudySet(this.user_id, this.set._id)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe()
      }
    })
  }

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }
}
