import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AssignmentService } from '../assignment.service';
import { CoursesService } from '../courses.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.css'],
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
export class AddAssignmentComponent implements OnInit, OnDestroy {
  @Input() topicId;
  @Input() courseId;

  fileIcon = faFile;
  errorState = 'hidden';

  currentDate = new Date();

  availableFrom;

  files = [];

  error;
  constructor(private assignmentService: AssignmentService,
  		      private courseService: CoursesService,
  		      private route: ActivatedRoute,
  		      private router: Router) { }

  ngOnInit() {
  	
    console.log(this.topicId);


  	this.currentDate.setHours(this.currentDate.getHours() + 2);
  	this.availableFrom = this.currentDate.toISOString().slice(0, 16);
  }

  removeFile(index) {
  	this.files.splice(index, 1);
  }

  saveFile(event) {
  	let files: FileList = event.target.files;

  	this.files.push(files[0]);

  	let size = 0;
  	this.files.forEach(file => {
  		size += file.size;
  	});
  	if (size / 1000000 > 10) {
  		this.error = "Files are too big";
  		this.errorState = 'shown';
  		setTimeout(() => {
  			this.errorState = 'hidden';
  		}, 2000);
  		// this.files = [];
  	}
  	console.log(this.files);
  }

  createAssignment(form: NgForm){ 
  	if (this.files.length === 0) {
  		this.error = "Please choose a file";
  		this.errorState = 'shown';
  		setTimeout(() => {
  			this.errorState = 'hidden';
  		}, 2000);
  	} else {
  		const title = form.value.title;
      const hide = form.value.hide || false;
  		const descr = form.value.description;
  		const availableFrom = form.value.availableFrom;
  		const deadline = form.value.deadline;
  		const maxGrade = form.value.maxGrade;
  		
  		if (deadline !== '' && deadline < availableFrom) {
  			this.error = "Please choose correct deadline";
	  		this.errorState = 'shown';
	  		setTimeout(() => {
	  			this.errorState = 'hidden';
	  		}, 2000);
  		} else {
  			let formData: FormData = new FormData();

	  		this.files.forEach(file => {
	  			formData.append('file', file, file.name);
	  		});
	  		formData.append('title', title);
        formData.append('hidden', hide);
	  		formData.append('description', descr);
	  		formData.append('availableFrom', availableFrom);
	  		formData.append('deadline', deadline);
	  		formData.append('maxGrade', maxGrade);

	  		formData.append('courseId', this.courseId);
    		formData.append('topicId', this.topicId);


	  		console.log(formData);
	  		this.assignmentService.createAssignment(
	  			formData)
	  			.subscribe(result => {
	  				this.courseService.showAssignment(null);
	  				this.courseService.sendNewFeedPost(result);
	  			}, err => {
	  				this.courseService.showAssignment(null);
	  			});
	  		}
  	}
  }

  ngOnDestroy() {
  	this.topicId = null;
  }
}
