import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudySet } from 'app/shared/models/study-set.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudySetService } from '../../shared/services/study-set.service'


@Component({
  selector: 'app-study-sets',
  templateUrl: './study-sets.component.html',
  styleUrls: ['./study-sets.component.scss']
})
export class StudySetsComponent implements OnInit, OnDestroy {
  user_id = localStorage.getItem('user_id');
  Unsubscribe = new Subject();

  studySets: StudySet[];

  constructor(private studySetService: StudySetService, private router: Router ) { }

  ngOnInit(): void {
    this.studySetService.getStudySets(this.user_id)
    this.studySetService.onStudySetsObs$
    .pipe(takeUntil(this.Unsubscribe))
    .subscribe(study_sets => {
      this.studySets = study_sets;
    })
  }

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }

}
