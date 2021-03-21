import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopicService } from '../topic.service';
import { TestService } from '../test.service';
import { map, mergeMap } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-testwork',
  templateUrl: './add-testwork.component.html',
  styleUrls: ['./add-testwork.component.css']
})
export class AddTestworkComponent implements OnInit, OnDestroy {
  courseId;
  topicId;
  createForm;

  // editMode = false;
  editTestwork;

  trashIcon = faTrashAlt;

  // sub: Subscription;

  constructor(private route: ActivatedRoute,
  			  private topicService: TopicService,
  			  private testworkService: TestService,
  			  private router: Router) { }

  ngOnInit() {
  	this.createForm = new FormGroup({
  		'title': new FormControl('', Validators.required),
  		'hidden': new FormControl(false, Validators.required),
  		'deadline': new FormControl('', Validators.required),
  		'hours': new FormControl(0, Validators.required),
  		'minutes': new FormControl(0, Validators.required),
      'tries': new FormControl(1, Validators.required),
  		'testQuestions': new FormArray([])
  	});

  	this.route.parent.params.subscribe(params => {
  		this.courseId = params['id'];
  	});

  	this.route.queryParams.subscribe(queryParams => {
  		if (queryParams['topicId']) {
  			this.topicId = queryParams['topicId'];
  		} else {
	  		this.router.navigate(['/course/', this.courseId]);
  		}

  		if (queryParams['testworkId']) {
  			// this.editMode = queryParams['editMode'];
  			this.testworkService
  			.getTestwork({testId: queryParams['testworkId']})
  			.subscribe(testwork => {
				if (testwork) {
					this.editTestwork = testwork;
		  			this.createForm.patchValue({
		  				'title': this.editTestwork.title,
              'tries': this.editTestwork.tries,
		  				'deadline': this.editTestwork.deadline.slice(0, 16),
		  				'hours': Math.floor(this.editTestwork.timeRestriction /  3600),
		  				'minutes': Math.floor(this.editTestwork.timeRestriction % 3600 / 60),
		  			});
		  		}  else {
			  		this.router.navigate(['/course/', this.courseId]);
		  		}

		  		let patchQuestions = (<FormArray>this.createForm.get('testQuestions'));
		  		this.editTestwork.questions.forEach((question: {a}, i) => {
		  			console.log(question, i);

		  			if (question.a) {
		  				this.onAddTestQuestion();
		  			} else {
		  				this.onAddQuestion();
		  			}
		  			patchQuestions.controls[i].patchValue(question);
		  		});
  			});
  			
  		}
  	});

  }

  deleteTest() {
  	this.testworkService.deleteTestwork({testId: this.editTestwork._id}).subscribe(result => {
		this.router.navigate(['/course/', this.courseId]);
  	});
  }

  onAddTestQuestion() {
  	const group = new FormGroup({
  		'title': new FormControl('', Validators.required),
  		'a': new FormControl('', Validators.required),
  		'b': new FormControl('', Validators.required),
  		'c': new FormControl('', Validators.required),
  		'd': new FormControl('', Validators.required),
  		'answer': new FormControl('', Validators.required),
  		'points': new FormControl('', Validators.required),
  	});
  	(<FormArray>this.createForm.get('testQuestions')).push(group);
  	document.getElementById('create__btn').scrollIntoView({ behavior: 'smooth' });
  }

  onAddQuestion() {
  	const group = new FormGroup({
  		'title': new FormControl('', Validators.required),
  		'answer': new FormControl('', Validators.required),
  		'points': new FormControl('', Validators.required),
  		'autoCheck': new FormControl(false, Validators.required),
  	});
  	(<FormArray>this.createForm.get('testQuestions')).push(group);
  	document.getElementById('create__btn').scrollIntoView({ behavior: 'smooth' });
 	console.log(this.createForm);
  }

  removeQuestion(index) {
  	(this.createForm.get("testQuestions") as FormArray).removeAt(index);
  }
 
  saveTestwork() {
  	const testQuestions = this.createForm.value.testQuestions;
  	if (testQuestions !== []) {
  		const title = this.createForm.value.title;
      const tries = this.createForm.value.tries;
	  	const deadline = this.createForm.value.deadline;
	  	const hidden = this.createForm.value.hidden;
	  	const timeRestriction = this.createForm.value.hours * 3600 + this.createForm.value.minutes * 60;
	  	console.log(this.createForm.value.testQuestions);

	  	if (this.editTestwork) {
	  		this.testworkService.updateTestwork({
		  		testId: this.editTestwork._id,
		  		title: title, 
          tries: tries,
		  		deadline: deadline, 
		  		hidden: hidden,
		  		timeRestriction: timeRestriction,
		  		questions: testQuestions}).subscribe(result => {
		  			this.router.navigate(['/course/', this.courseId]);
		  	});
	  	} else {
	  		this.testworkService.createTestwork({
		  		courseId: this.courseId,
		  		title: title, 
          tries: tries,
		  		deadline: deadline, 
		  		hidden: hidden,
		  		timeRestriction: timeRestriction,
		  		topicId: this.topicId,
		  		questions: testQuestions}).subscribe(result => {
		  			this.router.navigate(['/course/', this.courseId]);
		  	});
	  	}
	  	
  	} else {
  		//show error
  	}
  }

  ngOnDestroy() {
  	// this.sub.unsubscribe();
  }

}
