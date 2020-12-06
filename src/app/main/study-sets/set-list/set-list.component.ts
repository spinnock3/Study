import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudySet } from 'app/shared/models/study-set.model';
import { StudySetService } from 'app/shared/services/study-set.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-set-list',
  templateUrl: './set-list.component.html',
  styleUrls: ['./set-list.component.scss']
})
export class SetListComponent implements OnInit {
  user_id = localStorage.getItem('user_id');
  Unsubscribe = new Subject();

  studySets: StudySet[];
  selectedSet: StudySet;

  constructor(private studySetService: StudySetService, private router: Router) { }

  newSet() {
    this.router.navigate(['study-sets/study-set'], {queryParams: {
      _id: 'new'
    }},)
  }

  ngOnInit(): void {
    this.studySetService.onStudySetsObs$
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(study_sets => {
      this.studySets = study_sets;
    })
  }

}
