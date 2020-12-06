import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { StudySet } from 'app/shared/models/study-set.model';
import { CourseService } from 'app/shared/services/course.service';
import { Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { StudySetService } from '../../../shared/services/study-set.service'


@Component({
  selector: 'app-study-set',
  templateUrl: './study-set.component.html',
  styleUrls: ['./study-set.component.scss']
})
export class StudySetComponent implements OnInit, OnDestroy {
  user_id = localStorage.getItem('user_id');
  Unsubscribe = new Subject();
  studySet: StudySet;
  curr_setData: StudySet;
  set_id;
  course_id;
  exam_id;
  new: Boolean = false;
  edit: Boolean = false;

  constructor(private studySetService: StudySetService, private calendarService: CalendarService, private courseService: CourseService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.set_id = params['_id'];



      if (this.set_id === 'new') {
        this.new = true;
        this.studySet = {
          name: '',
          cards: []
        }
        this.addCard();
        if(params['course_id']) this.course_id = params['course_id'];
        else if (params['exam_id']) this.exam_id = params['exam_id'];
      }
      else if (params['edit']) {
        this.edit = true;
      }



    })
  }

  ngOnInit(): void {

    this.studySetService.onStudySetObs$
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(study_set => {
        this.studySet = JSON.parse(JSON.stringify(study_set));
        this.curr_setData = JSON.parse(JSON.stringify(study_set));
      })

    if (this.set_id && this.set_id !== 'new' && !this.studySet) {
      this.studySetService.getStudySet(this.user_id, this.set_id);
    }
  }

  addCard() {
    this.studySet.cards.push(
      {
        front: '',
        back: ''
      })
  }

  saveSet() {
    if (this.course_id) {
      this.studySetService.addStudySet(this.user_id, this.studySet)
        .pipe(takeUntil(this.Unsubscribe),
          mergeMap(set => {
            this.new = false;
            return this.courseService.addStudySet(this.user_id, this.course_id, set._id)
          }))
        .subscribe(course => {
          this.router.navigate(['courses'], {
          })
        })
    }

    else if (this.exam_id) {
      this.studySetService.addStudySet(this.user_id, this.studySet)
        .pipe(takeUntil(this.Unsubscribe),
          mergeMap(set => {
            this.new = false;
            return this.calendarService.addStudySet(this.user_id, this.exam_id, set._id)
          }))
        .subscribe(exam => {
          this.router.navigate(['exams'], {
          })
        })
    }

    else {
      this.studySetService.addStudySet(this.user_id, this.studySet)
        .pipe(takeUntil(this.Unsubscribe))
        .subscribe(set => {
          this.new = false;
          this.router.navigate(['study-sets/study-set'], {
            queryParams: {
              _id: this.studySet._id
            }
          })
        })
    }
  }

  toggleEdit(editMode) {
    if(editMode) {
      this.curr_setData = JSON.parse(JSON.stringify(this.studySet));
    } 
    else {
      this.studySet = JSON.parse(JSON.stringify(this.curr_setData));
    }
    this.edit = editMode;
  }


  editSet() {
    this.studySetService.updateStudySet(this.user_id, this.studySet)
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set => {
        this.edit = false;
        this.router.navigate(['study-sets/study-set'], {
          queryParams: {
            _id: this.studySet._id
          }
        })
      })
  }

  /**
   * Delete card in edit mode
   * @param index 
   */
  deleteCard(index) {
    this.studySet.cards.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }

}
