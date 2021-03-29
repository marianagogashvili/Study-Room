import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleService } from '../article.service';
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
      transition('shown <=> hidden', animate(300)),
    ])
  ]
})
export class AddArticleComponent implements OnInit {
  @ViewChild("container", {static: false}) container: ElementRef;
  @Input() topicId;
  @Input() courseId;

  popupState = 'hidden';

  articleForm: FormGroup;

  boldIcon = faBold; italicIcon = faItalic; underIcon = faUnderline;
  ulIcon = faListUl; olIcon = faListOl;
  centerIcon = faAlignCenter; leftIcon = faAlignLeft; rightIcon = faAlignRight;
  sizeIcon = faFont; redoIcon = faRedoAlt;

  article="";
  defaultFontSize = 3;

  constructor(private articleService: ArticleService) { }
  
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
  }

  createArticle() {
  	console.log(this.articleForm.value.title);
  	console.log(this.article);
  	console.log(this.courseId);
  	console.log(this.topicId);
  	if (this.article === '') {
  		const div = document.getElementById('article');
  		div.style.border = '2px solid #bf6767';
  		setTimeout(() => {
  			div.style.border = '2px solid #F2F2F2';
  		}, 2000);
  		
  	} else {
  		this.articleService.createArticle({
			title: this.articleForm.value.title, 
			text: this.article,
			topicId: this.topicId,
			courseId: this.courseId}).subscribe(result => {

				this.articleService.closePopup();
  		});
  	}

  	
  }

  showExitPopup() {
  	console.log("he");
  	if (this.article !== '' || this.articleForm.value.title !== '') {
  		this.popupState = 'shown';
  	}
  }

  closePopup() {
  	this.popupState = 'hidden';
  }

  exit() {
  	this.articleService.closePopup();
  }

  add(val) {
  	const div = document.querySelector('.article');
  	const ul = document.createElement(val); // ul or ol
  	var li = document.createElement('li');
  	ul.appendChild(li);

  	this.container.nativeElement.appendChild(ul);

  }

  change(val) {
  	document.execCommand(val, false, null);
  }


  resize(val) {
  	if (this.defaultFontSize + val <= 7 && this.defaultFontSize + val >=1) {
  		this.defaultFontSize = this.defaultFontSize + val;
  	}
  	console.log(this.defaultFontSize);
  	document.execCommand('fontSize', false, this.defaultFontSize.toString());
  }

}
