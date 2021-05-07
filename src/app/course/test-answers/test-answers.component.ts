import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router,NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

import { TestService } from '../test.service';
import { CoursesService } from '../courses.service';
import { HomeService } from '../../home.service';

import { Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-test-answers',
  templateUrl: './test-answers.component.html',
  styleUrls: ['./test-answers.component.css']
})
export class TestAnswersComponent implements OnInit, OnDestroy {
  students;
  defaultStudents;
  testworkId;

  groups;
  searchForm: FormGroup;

  minusIcon = faMinus;
  checkIcon = faCheck;
  redoIcon = faRedo;
  upIcon = faAngleUp;
  downIcon = faAngleDown;

  gradeSort;
  passedSort;
  questionSort;

  sub: Subscription;

  constructor(private testworkService: TestService,
          private homeService: HomeService,
  			  private router: Router,
  			  private courseService: CoursesService,
  			  private route: ActivatedRoute) { }

  ngOnInit() {
  	this.searchForm = new FormGroup({
  		'fullName': new FormControl(),
  		'login': new FormControl(),
  		'group': new FormControl(''),
  	});


  	this.homeService.getGroups().subscribe(groups => {
  		this.groups = groups;
  	});

    this.sub = this.route.queryParams.pipe(map(params => {
      let testId = params['testworkId'];
      if (!testId) {
        this.router.navigate(['../'], {relativeTo: this.route});
      }
      return testId;
    }), mergeMap((testworkId):any => {
      this.testworkId = testworkId;
      return this.testworkService.getAnswersForTeacher({testId: this.testworkId});
    }), mergeMap((result):any => {
        console.log(result);
        this.students = result;
        this.defaultStudents = result;
        return this.testworkService.studentsAnswers;
    })).subscribe((updatedStudent: any)  => {
        console.log(updatedStudent);
        if (updatedStudent) {
          this.students.forEach(student => student._id === updatedStudent._id ? student = updatedStudent : false);
          this.defaultStudents = this.students;
        }
    });

  	// this.route.queryParams.subscribe(params => {
  	// 	this.testworkId = params['testworkId'];
  	// 	this.testworkService.getAnswersForTeacher({testId: this.testworkId})
  	// 		.subscribe(result => {
  	// 			this.students = result;
  	// 			this.defaultStudents = result;
  	// 			console.log(this.students);
  	// 		});
  	// });

  	// this.testworkService.studentsAnswers.subscribe((updatedStudent: any) => {
  	// 	if (updatedStudent) {
  	// 		this.students.forEach(student => student._id === updatedStudent._id ? student = updatedStudent : false);
  	// 		// student = updatedStudent;
  	// 		this.defaultStudents = this.students;
  	// 	}
  		
  	// });
  	
  }

  goToGrade(student) {
  	if (student.answers.length > 0) {
  		this.router.navigate(['gradeAnswers'], { queryParams: {testworkId: this.testworkId} , relativeTo: this.route });
  		this.testworkService.sendAnswers(student);
  	}
  }

  orderByGrade(type) {
  	this.gradeSort = type;
  	this.students.sort((a, b): any => {
  		if (type === 'asc') {
  			return b.sumPoints - a.sumPoints;
  		} else if (type === 'desc'){
  			return a.sumPoints - b.sumPoints;
  		}
  	});
  }

  orderByPassed(type) {
  	this.passedSort = type;
  	this.students.sort((a, b): any => {
  		if (type === 'asc') {
  			return b.answers.length - a.answers.length;
  		} else if (type === 'desc'){
  			return a.answers.length - b.answers.length;
  		}
  	});
  }

  orderByQuestion(type) {
  	this.questionSort = type;
  	this.students.sort((a, b): any => {
  		if (type === 'asc') {
  			return b.gradedQuestions - a.gradedQuestions;
  		} else if (type === 'desc'){
  			return a.gradedQuestions - b.gradedQuestions;
  		}
  	});
  }

  clearSearch() {
  	this.searchForm.patchValue({'fullName': '', 'login': '', 'group': ''});
  	this.students = this.defaultStudents;
  } 

  findStudents() {
  	const name = this.searchForm.value.fullName;
  	const login = this.searchForm.value.login;
  	const group = this.searchForm.value.group;


    this.students = this.defaultStudents.filter(student => (name ? student.fullName.toLowerCase().includes(name.toLowerCase()) : true) &&
  			(group ? student.group === group : true)
  	);

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
