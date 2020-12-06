import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { StudySet } from 'app/shared/models/study-set.model';
import { StudySetService } from 'app/shared/services/study-set.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-study-session',
  templateUrl: './study-session.component.html',
  styleUrls: ['./study-session.component.scss']
})
export class StudySessionComponent implements OnInit {
  user_id = localStorage.getItem('user_id');
  set_id;
  studySet: StudySet;
  curr_card;
  Unsubscribe = new Subject();
  card_set = false;

  constructor(private studySetService: StudySetService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.set_id = params['_id'];
    })

  }

  ngOnInit(): void {
    this.studySetService.onStudySetObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(study_set => {
        this.studySet = JSON.parse(JSON.stringify(study_set));
        if (!this.card_set) {
          this.curr_card = this.studySet.cards[0];
          this.card_set = true;
        }
      })


    if ((this.set_id && !this.studySet) || this.studySet._id != this.set_id) {
      this.card_set = false;
      this.studySetService.getStudySet(this.user_id, this.set_id);
    }
  }

  changeCard(dir) {
    if (dir === "next" && this.studySet.cards.length - 1 != this.studySet.cards.findIndex(c => c._id === this.curr_card._id)) {
      this.curr_card = this.studySet.cards[this.studySet.cards.findIndex(c => c._id === this.curr_card._id) + 1];
    }

    if (dir === "prev" && this.studySet.cards.findIndex(c => c._id === this.curr_card._id) != 0) {
      this.curr_card = this.studySet.cards[this.studySet.cards.findIndex(c => c._id === this.curr_card._id) - 1];
    }

  }

}
