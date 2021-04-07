import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { TestService } from '../../test.service';

@Component({
  selector: 'app-grade-answers',
  templateUrl: './grade-answers.component.html',
  // styleUrls: ['./grade-answers.component.css']
  styleUrls: ['../../testwork/testwork.component.css', './grade-answers.component.css']

})
export class GradeAnswersComponent implements OnInit, OnDestroy {
  studentAnswer;
  student;
  testId;

  pointsForm: FormGroup = new FormGroup({
  	'answers': new FormArray([])
  });
  sub: Subscription;

  constructor(private testworkService: TestService,
  			  private router: Router,
  			  private route: ActivatedRoute) { }

  ngOnInit() {
  	this.route.queryParams.subscribe(params => {
  		this.testId = params['testworkId'];
  		if (!this.testId) {
  			this.router.navigate(['../../'], {relativeTo: this.route});
  		}
  	});

  	this.sub = this.testworkService.studentsAnswers.subscribe((student: any) => {
  		if (student) {
  			this.student = student;
  			console.log(this.student);
	  		student.answers.forEach(answer => {
	  			
	  			const answ = new FormGroup({
			  		'question': new FormControl(answer.question._id.toString(), Validators.required),
			  		'answer': new FormControl(answer.studentAnswer, Validators.required),
			  		'answers': new FormControl(answer.studentAnswers, Validators.required),
            'grade': new FormControl(answer.points, Validators.required)
			  	});

	  			this.studentAnswer = student.answers;
          // console.log(this.studentAnswer);
	  			(<FormArray>this.pointsForm.get('answers')).push(answ);
		  		// console.log(this.pointsForm.value);
	  		});
  		} else {
  			this.router.navigate(['../'], {queryParams: {testworkId: this.testId}, relativeTo:this.route});  			
  		}

  	});

  }

  saveGrade() {
  	let noChanges = true;
  	this.studentAnswer.forEach((answ, index) => {
  		if (this.pointsForm.value.answers[index].grade !== answ.points) {
  			noChanges = false;
        return noChanges;
  		}
  	});

  	if (!noChanges) {
  		this.testworkService.updateAnswers(
  		   {answers: JSON.stringify(this.pointsForm.value.answers), 
  			testId: this.testId, 
  			student: this.student._id})
  		.subscribe(result => {
  			console.log(this.student);
  			let sumPoints = 0;
        let gradedQuestions = 0;
  			this.pointsForm.value.answers.forEach((val, index) => {
  				sumPoints += val.grade;
          if (val.grade || val.grade === 0) {
            gradedQuestions += 1;
          }
  				this.student.answers[index].points = val.grade;
  			});
  			this.student.sumPoints = sumPoints;
        this.student.gradedQuestions = gradedQuestions;

  			this.testworkService.sendAnswers(this.student);
  			this.router.navigate(['../'], {queryParams: {testworkId: this.testId}, relativeTo:this.route});
  			
  		});
  	} else {
  		this.router.navigate(['../'], {queryParams: {testworkId: this.testId}, relativeTo:this.route});  		
  	}
  }
  
  ngOnDestroy() {
  	this.sub.unsubscribe();
  }
}
