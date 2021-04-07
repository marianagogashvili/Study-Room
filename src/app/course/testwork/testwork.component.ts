import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router,NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { TestService } from '../test.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-testwork',
  templateUrl: './testwork.component.html',
  styleUrls: ['./testwork.component.css']
})
export class TestworkComponent implements OnInit, OnDestroy {
  testwork;
  studentAnswer = null;
  available;

  timeRestriction;
  loading;

  workMode = false;
  currentQuestionId;

  answerForm: FormGroup;
  answersForm: FormGroup;

  subscription;

  answers = []; // {question_id: , answer: 'b'}
  timerVal = '';
  timer;

  answer;

  //delete
  a_answ = false; b_answ = false; c_answ = false; d_answ = false; e_answ = false; f_answ = false;

  secondsLeft;
  currentDate = new Date(new Date().setHours(new Date().getHours() + 2));

  sub: Subscription;
  constructor(private testworkService: TestService,
          private route: ActivatedRoute,
          private cookieService: CookieService,
          private router: Router) { }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.workMode === true) {

      if (this.testwork.questions[this.currentQuestionId].hasOwnProperty('autoCheck')) {
        this.answers[this.currentQuestionId] = this.answerForm.value.answer;
      } else if (this.testwork.questions[this.currentQuestionId].answers) {
        this.saveMultipleChoiceQuestion();
      } 

      this.cookieService.set('Answers', JSON.stringify(this.answers));
      this.cookieService.set('Secs', JSON.stringify(this.secondsLeft));
      clearInterval(this.timer);
    }
  }

  ngOnInit() {

    this.sub = this.router.events.subscribe((val) => {
      if(this.workMode && (val instanceof NavigationEnd))  {
        this.saveTest();
      }
    });

    this.loading = true;

    this.answerForm = new FormGroup({
      'answer': new FormControl('', Validators.required)
    });

    this.answersForm = new FormGroup({
      'a': new FormControl(false, Validators.required),
      'b': new FormControl(false, Validators.required),
      'c': new FormControl(false, Validators.required),
      'd': new FormControl(false, Validators.required),
      'e': new FormControl(false, Validators.required),
      'f': new FormControl(false, Validators.required)
    });

    this.route.queryParams.pipe(map(params => {
      let testId = params['testId'];
      if (!testId) {
        this.router.navigate(['../'], {relativeTo: this.route});
      }
      return testId;
    }), mergeMap((id):any => {
      return this.testworkService.getTestwork({testId: id})
    }), mergeMap((testwork):any => {
      this.testwork = testwork;
      this.available = (this.currentDate < new Date(this.testwork.deadline));

      this.currentQuestionId = 0;
      this.timeRestriction = this.convertTime(this.testwork.timeRestriction);
    
      return this.testworkService.getAnswers({testId: this.testwork._id})
    })).subscribe((answer: {answers: [{question}]}) => {
      this.studentAnswer = answer;
      console.log(this.studentAnswer);

      let cookieAnswers = this.cookieService.get('Answers');
      let cookieSeconds = this.cookieService.get('Secs');

      if (cookieAnswers || cookieSeconds) {
        this.workMode = true;
        this.answers = JSON.parse(cookieAnswers);
        
        this.patchValues();
        
        this.timer = this.startTimer(cookieSeconds);
      }  

      this.loading = false;
    });

  }

  startTheTest() {
    this.workMode = true;
    if (this.testwork.timeRestriction) {
      let seconds = this.testwork.timeRestriction;
      this.timerVal = this.convertTime(seconds);
      this.timer = this.startTimer(seconds);
    }
    
  }

  startTimer(seconds) {
    var timer = setInterval(() => {
      this.timerVal = this.convertTime(seconds);
      seconds--;
      this.secondsLeft = seconds;
      if (seconds < 0) {
        clearInterval(timer);
        this.saveTest();
      }
    }, 1000);
    return timer;
  }

  convertTime(seconds) {
    return (Math.floor(seconds / 3600) > 0 ? Math.floor(seconds / 3600) === 1 ? Math.floor(seconds / 3600) + " hr " : Math.floor(seconds / 3600) + " hrs " : '') + 
      (Math.floor(seconds % 3600 / 60) > 0 ? Math.floor(seconds % 3600 / 60) === 1 ? Math.floor(seconds % 3600 / 60)+ " min " : Math.floor(seconds % 3600 / 60) + " mins " : '') + 
      (seconds % 60 > 0 ? seconds % 60 === 1 ? seconds % 60 + " sec " : seconds % 60 + " secs " : '');
  }

  saveTest() {
    if (this.testwork.questions[this.currentQuestionId].hasOwnProperty('autoCheck')) {
      this.answers[this.currentQuestionId] = this.answerForm.value.answer;
      this.answerForm.patchValue({'answer': ''});
    } else if (this.testwork.questions[this.currentQuestionId].answers) {
      this.saveMultipleChoiceQuestion();
    } 
    
    let finalAnswers = [];
    this.testwork.questions.forEach((question, i) => {
      if (this.testwork.questions[i].hasOwnProperty('answers')) {
        finalAnswers.push({question: question._id, answers: this.answers[i] || null });
      } else {
        finalAnswers.push({question: question._id, answer: this.answers[i] || null});
      }
    });

    console.log(finalAnswers);

    this.testworkService.saveAnswers({answers: JSON.stringify(finalAnswers), testId: this.testwork._id}).subscribe(result => {
      clearInterval(this.timer);
      this.cookieService.delete('Answers');
      this.cookieService.delete('Secs');

      this.testworkService.getAnswers({testId: this.testwork._id})
      .subscribe((answer: {answers: [{question}]}) => {
        this.studentAnswer = answer;
        this.workMode = false;
        this.answers = [];
      });
    });
  }

  addAnswer(answer) {
     this.answers[this.currentQuestionId] = answer;
  }

  addAnswers() {
    this.saveMultipleChoiceQuestion();
    this.goToNextQuestion();
  }

  addWrittenAnswer() {
    this.answers[this.currentQuestionId] = this.answerForm.value.answer;
    this.goToNextQuestion();
  }

  goToNextQuestion() {
    this.currentQuestionId += 1;
    this.patchValues();
  }

  goToQuestion(i) {
    if (this.testwork.questions[this.currentQuestionId].hasOwnProperty('autoCheck')) {
      this.answers[this.currentQuestionId] = this.answerForm.value.answer;
      this.answerForm.patchValue({'answer': ''});
    } else if (this.testwork.questions[this.currentQuestionId].answers) {
      this.saveMultipleChoiceQuestion();
    } 

    this.currentQuestionId = i;
    this.patchValues();

  }

  saveMultipleChoiceQuestion() {
    let allFalse = true;
    for (const key in this.answersForm.value) {
      if (this.answersForm.value[key] === true) {
        allFalse = false;
      }
    }
    if (!allFalse) {
      this.answers[this.currentQuestionId] = this.answersForm.value;
      this.answersForm.patchValue({'a': false, 'b': false, 'c': false, 'd': false, 'e': false, 'f': false });
    } else {
      this.answers[this.currentQuestionId] = null;
    }

  }

  patchValues() {
    if (this.testwork.questions[this.currentQuestionId].hasOwnProperty('autoCheck')) {
      this.answerForm.patchValue({'answer': this.answers[this.currentQuestionId]});
    } else if (this.testwork.questions[this.currentQuestionId].answers) {
      if (this.answers[this.currentQuestionId]) {
        this.answersForm.patchValue({
          'a': this.answers[this.currentQuestionId].a,
          'b': this.answers[this.currentQuestionId].b,
          'c': this.answers[this.currentQuestionId].c,
          'd': this.answers[this.currentQuestionId].d,
          'e': this.answers[this.currentQuestionId].e,
          'f': this.answers[this.currentQuestionId].f
        });
      }
    } 
  }

  ngOnDestroy() {
    if (this.sub && !this.workMode) {
      this.sub.unsubscribe();
    }
  }

}
