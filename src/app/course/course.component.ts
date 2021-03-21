import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { CoursesService } from './courses.service';
import { HomeService } from '../home.service';

import { Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  animations: [
  trigger('errorState', [
      state('shown', style({
        transform: 'translateX(0px)',
        opacity: 1,
        visibility: 'visible'
      })),
      state('hidden', style({
        transform: 'translateY(-50px)',
        opacity: 0,
        visibility: 'hidden'
      })),
      transition('shown <=> hidden', animate(300)),
    ])
  ]
})
export class CourseComponent implements OnInit,  OnDestroy {
  loading;
  course;
  fields;

  editMode = false;
  editForm: FormGroup;

  addAssignment = false; addPost = false; addArticle = false;
  

  assignmentTopicIdAndParent; postTopicId; articleTopicId;
  userType;

  errors;
  errorState = 'hidden';
  deleteCourseState = 'hidden';

  allowedUser = false;

  // sub: Subscription;
  sub2: Subscription;


  constructor(private route: ActivatedRoute,
  			  private router: Router,
  			  private courseService: CoursesService,
          private homeService: HomeService) { 
    // this.sub = this.courseService.userType.subscribe(type => {
    //   this.userType = type.type;
    // });
  	router.events.subscribe((val) => this.editMode = false);
}

  ngOnInit() {
    this.homeService.getFields().subscribe(fields => {
      this.fields = fields;
      console.log(this.fields);
    });

  	this.courseService.assignmentMode.subscribe(topicIdAndParent => {
  		this.assignmentTopicIdAndParent = topicIdAndParent;
  		this.addAssignment = !this.addAssignment;
  	});

    this.courseService.postMode.subscribe((topicId) => {
      this.postTopicId = topicId;
      this.addPost = !this.addPost;
    });

    this.courseService.articleMode.subscribe((topicId) => {
      this.articleTopicId = topicId;
      this.addArticle = !this.addArticle;
    });

  	this.editForm = new FormGroup({
  		'title': new FormControl('', [Validators.required]),
  		'description': new FormControl('', [Validators.required]),
  		'key': new FormControl(''),
      'field': new FormControl('', [Validators.required]),
      'opened': new FormControl('', [Validators.required])
  	});

  	this.loading = true;
    this.sub2 = this.route.params.pipe(map(result => {
      return result['id'];
    }), mergeMap((id):any => {
      return this.courseService.getCourse({id: id})
    }), mergeMap((course):any =>{
      this.course = course;
      this.courseService.courseId = this.course._id;
      this.loading = false;
      return this.courseService.userType;
    })).subscribe((userType: {type, uid}) => {
      // console.log(userType);
      this.userType = userType.type;
      // let uid = localStorage.getItem('userId');
      if (userType.type === 'student' && this.course.students.filter(student => student._id === userType.uid).length > 0 ) {
          this.courseService.sendAllowedUser(this.userType);
      } else if (userType.type === 'teacher' && (userType.uid === this.course.creator._id)) {
          this.courseService.sendAllowedUser(this.userType);
      } else {
        this.courseService.sendAllowedUser(null);
        this.router.navigate(['/']);
      }
    });
   

  }

  updateCourse() {
  	const title = this.editForm.value.title;
  	const description = this.editForm.value.description;
  	const key = this.editForm.value.key;
    const field = this.editForm.value.field;
    const opened = this.editForm.value.opened;

  	if (title === this.course.title &&
  		description === this.course.description &&
  		key === this.course.key &&
      field === this.course.field.name &&
      opened === this.course.opened) {
  		this.showError("You haven't changed anything");
  	} else {
  		this.courseService.editCourse({
  			id: this.course._id, 
  			title: title, 
  			description: description,
  			key: key,
        opened: opened,
        field: field
      }).subscribe(result => {
  				this.course.title = title;
  				this.course.description = description;
          this.course.field.name = field;
          this.course.opened = opened;
  				this.editMode = false;
  			}, error => {
		  		this.showError(error);
  			});
  	}
  }

  switchToEditMode() {
  	this.editMode = !this.editMode;
  	if (this.editMode === true) {
  		this.editForm.patchValue({
  			title: this.course.title,
  			description: this.course.description,
  			key: this.course.key,
        field: this.course.field.name,
        opened: this.course.opened
  		});
  	}
  }

  showDeleteCourse() {
  	this.deleteCourseState = this.deleteCourseState === 'shown' ? 'hidden' : 'shown';
  }

  deleteCourse() {
  	this.courseService.deleteCourse({ id: this.course._id }).subscribe(result => {
  		this.router.navigate(['/']);
  	});
  }

  showError(value) {
  	this.errors = [{msg: value}];
  	this.errorState = 'shown';
  	setTimeout(() => {
  		this.errorState = 'hidden';
  	}, 2000);
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

}
