import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StudySetService } from '../../../shared/services/study-set.service'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrls: ['./study-card.component.scss']
})
export class StudyCardComponent implements OnInit, OnChanges {
  Unsubscribe = new Subject;
  user_id = localStorage.getItem('user_id');
  edit_mode = false;
  form: FormGroup;
  studyForm: FormGroup;
  show_back = false;
  answer_correct;
  curr_card_id;
  card_num;

  @Input() study_set;
  @Input() card;
  @Input() study;
  @Output() onChangeCard: EventEmitter<any> = new EventEmitter();;


  constructor(private studySetService: StudySetService) { }

  ngOnInit(): void {
    this.curr_card_id = this.card._id;
    this.card_num =this.study_set.cards.findIndex(c => c._id === this.card._id);

    this.studyForm = new FormGroup({
      userAnswer: new FormControl('', Validators.maxLength(10000)),
    })



    this.form = new FormGroup({
      front: new FormControl(this.card.front, Validators.maxLength(3000)),
      back: new FormControl(this.card.back, Validators.maxLength(10000))
    })
  }

  ngOnChanges() {
    if(this.curr_card_id !== this.card._id && this.studyForm) {
      this.card_num = this.study_set.cards.findIndex(c => c._id === this.card._id);
      this.curr_card_id = this.card._id;
      this.show_back = false;
      this.studyForm.get("userAnswer").patchValue('');
    }
  }

  toggleEdit(edit) {
    this.edit_mode = edit;
    this.form.setValue({
      front: this.card.front,
      back: this.card.back
    })
  }


  editCard() {
    this.card.front = this.form.get('front').value;
    this.card.back = this.form.get('back').value;
    this.studySetService.editCard(this.user_id, this.study_set._id, this.card)
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(() => {
        this.edit_mode = false;
      }, err => {
        this.edit_mode = false;
      });
  }

  deleteCard() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete this card?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.studySetService.deleteCard(this.user_id, this.study_set._id, this.card._id)
          .pipe(takeUntil(this.Unsubscribe))
          .subscribe()
      }
    })
  }

  checkAnswer() {
    let correct_answer = this.studyForm.get('userAnswer').value;
    this.answer_correct = (correct_answer.toLowerCase().trim() === this.card.back.toLowerCase().trim());

    this.studySetService.updateRetention(this.user_id, this.study_set._id, this.card._id, this.answer_correct)
      .pipe(takeUntil(this.Unsubscribe))
      .subscribe(set => {
        this.card = set.cards.find(card => card._id === this.card._id);
        this.show_back = true;
      }, error => {
        this.answer_correct = null;
        this.studyForm.get('userAnswer').patchValue(null);
      })
  }

  changeCard(dir) {
    console.log(dir);
    this.onChangeCard.emit(dir);
  }
  

  ngOnDestroy(): void {
    this.Unsubscribe.next();
    this.Unsubscribe.complete();
  }
}
