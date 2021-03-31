import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleService } from '../article.service';
import { CoursesService } from '../courses.service';

import { trigger, transition, state, animate, style } from '@angular/animations';

import { faBold } from '@fortawesome/free-solid-svg-icons';
import { faItalic } from '@fortawesome/free-solid-svg-icons';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { faListOl } from '@fortawesome/free-solid-svg-icons';
import { faUnderline } from '@fortawesome/free-solid-svg-icons';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css'],
  animations: [
  	trigger('popupState', [
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
      transition('shown <=> hidden', animate(200)),
    ])
  ]
})
export class AddArticleComponent implements OnInit {
  @Input() topicId;
  @Input() courseId;
  @Input() articleValue;

  popupState = 'hidden';

  articleForm: FormGroup;

  boldIcon = faBold; italicIcon = faItalic; underIcon = faUnderline;
  ulIcon = faListUl; olIcon = faListOl;
  centerIcon = faAlignCenter; leftIcon = faAlignLeft; rightIcon = faAlignRight;
  sizeIcon = faFont; redoIcon = faRedoAlt;

  article="";

  constructor(private articleService: ArticleService,
  		      private courseService: CoursesService) { }
  
  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  	if (this.article !== '') {
  		let title = this.articleForm.value.title ? this.articleForm.value.title : 'untitled';

  		this.articleService.createArticle({
			title: title, 
			text: this.article,
			topicId: this.topicId,
			courseId: this.courseId}).subscribe(result => {
				console.log(result);
  		});
  	}
  }

  ngOnInit() {

  	this.articleForm = new FormGroup({
  		'title': new FormControl('', Validators.required)
  	});


  	if (this.articleValue !== null) {
  		this.articleForm.patchValue({'title': this.articleValue.title})
  		document.getElementById('article').innerHTML = this.articleValue.text;

  	}

  }

  createArticle() {
  	// console.log(this.articleForm.value.title);
  	// console.log(this.article);
  	// console.log(this.courseId);
  	// console.log(this.topicId);
  	if (this.article === '' && this.articleValue === null) {
  		const div = document.getElementById('article');
  		div.style.border = '2px solid #bf6767';
  		setTimeout(() => {
  			div.style.border = '2px solid #F2F2F2';
  		}, 2000);
  		
  	} else {
  		if (!this.articleValue) {
  			this.articleService.createArticle({
				title: this.articleForm.value.title, 
				text: this.article,
				topicId: this.topicId,
				courseId: this.courseId}).subscribe(result => {
					this.articleService.closePopup();
					this.courseService.sendNewFeedPost(result);
	  		});
  		} else {
  			this.articleService.updateArticle({
  				id: this.articleValue._id,
				title: this.articleForm.value.title, 
				text: this.article || this.articleValue.text}).subscribe(result => {
					this.articleService.closePopup();
					this.courseService.sendNewFeedPost(result);
	  		});
  		}
  		
  	}

  	
  }

  showExitPopup() {
  	// console.log(this.article);
  	// console.log(this.articleValue.text);

  	// console.log(this.articleValue.text === this.article);
  	// console.log(this.articleForm.value.title === this.articleValue.title);
  	
  	if (!this.articleValue) {
  		if (this.article !== '' || this.articleForm.value.title !== '') {
	  		this.popupState = 'shown';
	  	} else {
	  		this.articleService.closePopup();
	  	}
  	} else if (this.articleValue !== null) {
  		if (this.article === '' || 
  		   (this.articleValue.text === this.article && 
  			this.articleForm.value.title === this.articleValue.title)) {
  			this.articleService.closePopup();
  		} else {
  			this.popupState = 'shown';
  		}
  	}
  	
  }

  closePopup() {
  	this.popupState = 'hidden';
  }

  exit() {
  	this.articleService.closePopup();
  }

  // add(val) {
  // 	const div = document.querySelector('.article');
  // 	const ul = document.createElement(val); // ul or ol
  // 	var li = document.createElement('li');
  // 	ul.appendChild(li);

  // 	this.container.nativeElement.appendChild(ul);

  // }

  change(val) {
  	document.execCommand(val, false, null);
  }


  resize(val) {
  	const selection = window.getSelection();
  	let size;
	if (selection) { 
	  size = window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
	  if (size === '10px') {
	  	size = 1;
	  } else if (size === '13px') {
	  	size = 2;
	  } else if (size === '16px') {
	  	size = 3;
	  } else if (size === '18px') {
	  	size = 4;
	  } else if (size === '24px') {
	  	size = 5;
	  } else if (size === '32px') {
	  	size = 6;
	  } else if (size === '48px') {
	  	size = 7;
	  }

	}

  	document.execCommand('fontSize', false, (size+val).toString());

  }

}
