import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssignmentService } from '../assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs/';
import { faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons';

import { CoursesService } from '../courses.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit, OnDestroy {
  sub: Subscription;
  loading;
  assignment;

  pdfIcon = faFilePdf;
  wordIcon = faFileWord;
  minusIcon = faMinusCircle;
  powerpointIcon = faFilePowerpoint;
  editMode = false;

  editForm: FormGroup;
  filesList;
  removeFilesList = [];
  addFilesList = [];

  error;

  userType;
  sub2: Subscription;

  constructor(private assignmentService: AssignmentService,
  			  private route: ActivatedRoute,
  			  private router: Router,
  			  private courseService: CoursesService) { }

  ngOnInit() {
  	this.sub2 = this.courseService.allowedUser.subscribe(type => {
  		this.userType =  type;
  		console.log(this.userType);
  	});

  	this.editForm = new FormGroup({
  		'title': new FormControl('', [Validators.required]),
      'hide': new FormControl(false, [Validators.required]),
  		'description': new FormControl('', [Validators.required]),
  		'availableFrom': new FormControl('', [Validators.required]),
  		'maxGrade': new FormControl('', [Validators.required]),
  		'deadline': new FormControl(''),

  	});

  	console.log(this.route.parent.snapshot);
  	this.loading = true;
  	this.sub = this.route.params.pipe(map(params => {
  		return params['assignmentId'];
  	}), mergeMap((id):any => {
		return this.assignmentService.getAssignmentById({id: id}).pipe(
			catchError((err):any => {
  				console.log(err);
  				this.router.navigate(['../../main'], {relativeTo: this.route});
  			})
		);	
  	})).subscribe(assignment => {
  		this.assignment = assignment;
  		this.loading = false;
  		console.log(this.assignment);
  	});

  }

  showEditMode() {
  	this.editMode = !this.editMode;
  	this.editForm.patchValue({
  		'title': this.assignment.title, 
      'hide': this.assignment.hidden, 
  		'description': this.assignment.description,
  		'maxGrade': this.assignment.maxGrade,
  		'availableFrom': this.assignment.availableFrom.slice(0, 16),
  		'deadline':  this.assignment.deadline ? this.assignment.deadline.slice(0, 16) : '',
  	});
  	this.filesList = [...this.assignment.fileUrl];

  	this.addFilesList = [];
  	this.removeFilesList = [];
  }


  saveFile(event) {
  	let files: FileList = event.target.files;
  	let file = files[0];

  	this.addFilesList.push(file);
  	let size = 0;
  	this.addFilesList.forEach(file => {
  		size += file.size;
  	});
  	if (size / 1000000 > 10) {
		this.error = "Files are too big";
		setTimeout(() => {
			this.error = null;
		}, 3000);
	}
  }

  removeFileFromList(file, i) {
  	this.filesList.splice(i, 1);
  	this.removeFilesList.push(file);
  }

 removeFileFromAddList(file, i) {
  	this.addFilesList.splice(i, 1);
  }

  downloadImage(url) {
  	let fileUrl =  "http://localhost:8000/" + url;
  	window.open(fileUrl, '_blank');
  }

  updateAssignment() {
  	const title = this.editForm.value.title;
    const hide = this.editForm.value.hide;
  	const description = this.editForm.value.description;
  	const availableFrom = this.editForm.value.availableFrom;
  	const maxGrade = this.editForm.value.maxGrade;
  	const deadline = this.editForm.value.deadline;

  	if (deadline !== '' && deadline < availableFrom) {
		this.error = "Please choose correct deadline";
		setTimeout(() => {
			this.error = null;
		}, 2000);
	} else if (title === this.assignment.title && 
      hide === this.assignment.hidden && 
  		description  === this.assignment.description &&
  		maxGrade === this.assignment.maxGrade && 
  		availableFrom === this.assignment.availableFrom.slice(0, 16) &&
  		deadline === this.assignment.deadline ? this.assignment.deadline.slice(0, 16) : null &&
  		this.addFilesList.length === 0 && this.removeFilesList.length === 0) {
  		this.error = "You haven't changed anything";
  		setTimeout(() => {
  			this.error = null;
  		}, 2000);
  	} else {
  		let formData: FormData = new FormData();
  		formData.append('id', this.assignment._id);
  		formData.append('title', title);
      formData.append('hide', hide);
  		formData.append('description', description);
  		formData.append('maxGrade', maxGrade);

  		formData.append('availableFrom', availableFrom);
  		formData.append('deadline', deadline);

  		formData.append('remove', JSON.stringify(this.removeFilesList));
  		this.addFilesList.forEach(file  => {
  			formData.append('file', file, file.name);
  		});
  		this.assignmentService.updateAssignment(formData).subscribe(result  => {
  			this.assignment = result;
  			this.showEditMode();
  		});
  		console.log(formData);
  	}
  }

  delete() {
  	this.assignmentService
  		.deleteAssignment({ id: this.assignment._id })
  		.subscribe(result => {
  			console.log(result);
  			this.router.navigate(['../../main'], {relativeTo: this.route});
  		}, err => {
  			this.router.navigate(['../../main'], {relativeTo: this.route});
  		});
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  	this.sub2.unsubscribe();
  }
}
