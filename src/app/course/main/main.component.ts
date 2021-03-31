import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { TopicService } from '../topic.service';
import { CoursesService } from '../courses.service';
import { ArticleService } from '../article.service';
import { AssignmentService } from '../assignment.service';
import { PostsService } from '../posts.service';
import { TestService } from '../test.service';

import { trigger, transition, state, animate, style } from '@angular/animations';

import { map, mergeMap } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';

import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleDown } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faFileWord } from '@fortawesome/free-regular-svg-icons';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-regular-svg-icons';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { faVial } from '@fortawesome/free-solid-svg-icons';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('deletePopup', [
      state('shown', style({
        transform: 'translateX(0px)',
        opacity: '1',
        visibility: 'visible'
      })),
      state('hidden', style({
        transform: 'translateX(40px)',
        opacity: '0',
        visibility: 'hidden'
      })),
      transition('shown <=> hidden', animate(300)),
    ]),
    trigger('deletePopupHidden', [
      state('shown', style({
        display: 'flex'
      })),
      state('hidden', style({
        display: 'none'
      })),
      transition('shown => hidden', animate('200ms ease')),
      transition('hidden => shown', animate('0ms ease')) // ease
    ])
  ]
})
export class MainComponent implements OnInit, OnDestroy {
  topicForm: FormGroup;
  editForm: FormGroup;

  topics;
  scrollEl = null;

  upIcon = faArrowCircleUp;
  downIcon = faArrowCircleDown;
  removeIcon = faTimesCircle;
  editIcon = faEdit;

  pdfIcon = faFilePdf;
  powerpointIcon = faFilePowerpoint;
  wordIcon = faFileWord;
  fileIcon = faFileAlt;
  testIcon = faVial;
  articleIcon = faAlignJustify;
  linkIcon = faExternalLinkAlt;
  minusIcon = faMinusCircle;
  arrowDownIcon = faArrowDown;

  deletePopup = 'hidden';
  deletePopupIndex = null;

  userType = null;
  allowedUser;

  newTopicMode = false;
  editIndex = null;
  beforeTopicNum = null;

  assignments;
  feed;
  marginLeft = 20;
  hiddenVal;

  sub: Subscription;
  sub2: Subscription;
  sub3: Subscription;

  constructor(private topicService: TopicService,
  			  private courseService: CoursesService,
  			  private postService: PostsService,
          private articleService: ArticleService,
  			  private route: ActivatedRoute,
  			  private router: Router,
  			  private assignmentService: AssignmentService,
  			  private testworkService: TestService) { }

  ngOnInit() {
  	this.sub3 = 
  		this.courseService.allowedUser.subscribe((allowedUserType):any => {
  			this.userType = allowedUserType;
  			console.log(this.userType);
  		});

  	this.topicForm = new FormGroup({
  		'title': new FormControl('', [Validators.required]),
  		'hidden': new FormControl(''),
  	});

  	this.editForm = new FormGroup({
  		'title': new FormControl('', [Validators.required]),
  		'hidden': new FormControl(''),
  	});

  	this.sub = this.topicService.oldTopics
  		.subscribe(topics => {
  		this.topics = topics;

  	});

  	this.route.parent.params.subscribe(params => {
  		this.sub2 = this.courseService.getFeed({courseId: params['id']})
  			.pipe(map(feed => {
  				console.log(feed);
  				this.feed = feed;
  				this.feed.forEach((feedVal, i) => {
            let parentId = i > 0 ? this.feed[i-1].parent : this.feed[i].parent;
            this.hiddenVal = i > 0 ? this.feed[i-1].hidden : this.feed[i].hidden;

            if (feedVal.parent && this.hiddenVal === true) {
              feedVal.hidden = this.hiddenVal;
            }
  				});

  				return feed;
  			}), mergeMap((feed):any => {
  				return this.topicService.getTopics({courseId: params['id']})
  			}), mergeMap((topics: any[]) => {
				topics.forEach(topic => {
					topic.feed = this.feed.filter(as => as.topic === topic._id);
				});

				return [topics];
  			}), mergeMap((topics: any[])  => {

  				this.topics = topics;
  				console.log(topics);
	  			this.topicService.sendTopics(topics);

  				return this.courseService.feedValue;
  			}), mergeMap((assignment): any => {
  				let topic = this.topics.filter(t => t._id === assignment.topic);

  				if (topic[0].feed) {

            if (!assignment.parent) {
              topic[0].feed[topic[0].feed.length] = assignment;
            } else {
              let i = topic[0].feed.findIndex(feed => feed._id === assignment.parent);

              assignment.marginLeft = topic[0].feed[i].marginLeft ? this.feed[i].marginLeft + 20 : 20;
              topic[0].feed.splice(i+1, 0, assignment);
            }
            
  				} else {
  					topic[0].feed =[ assignment ];			
  				}

				  return topic;
  			})).subscribe((topic:any)  => {

  			});

  	});


  	
  }
  ngAfterViewChecked() {
  	if (this.scrollEl !== null) {
  		document.getElementById(this.scrollEl).scrollIntoView({ behavior: 'smooth' });
  		this.scrollEl = null;
  	} 
  }

  goToCreateTest(topicId) {
  	this.router.navigate(['../add-testwork'], {queryParams: {topicId: topicId},relativeTo: this.route});
  }

  createTopic() {
  	const title = this.topicForm.value.title;
  	const hidden = this.topicForm.value.hidden || false;
  	const topic = { 
  			title: title, 
  			hidden: hidden, 
  			courseId: this.courseService.courseId,
  			beforeTopic: this.beforeTopicNum 
  		};
  	this.topicService.createTopic(topic)
  		.subscribe(result => {
  			console.log(result);
  			// result.assignments = [];
  			this.newTopicMode = false;
  			this.topicForm.controls['title'].setValue(' ');
  			if (!this.beforeTopicNum) {
	  			this.topics = [...this.topics, result];
	  			if (this.topics.length >= 2) {
	  				this.scrollEl = ("topic" + (this.topics.length-2));
	  			}
  			} else {
  				this.topics.splice((this.beforeTopicNum-1), 0, result);
	  			if (this.beforeTopicNum >= 2) {
	  				this.scrollEl = "topic" + (this.beforeTopicNum-2);
	  			}
	  			this.beforeTopicNum = null;
  			}  			

  			
  		});
  }


  editTopic(id) {
  	const topicId = id;
  	const title = this.editForm.value.title;
  	const hidden = this.editForm.value.hidden;
	// console.log(this.editForm.value);
  	this.topicService
  		.editTopic({id: topicId, title: title, hidden: hidden})
  		.subscribe((topic: {title, hidden}) => {
  			this.topics[this.editIndex].title = topic.title;
  			this.topics[this.editIndex].hidden = topic.hidden;

  			this.editIndex = null;
  		});
  }

  addBefore(topic) {
  	this.newTopicMode = true;
  	this.beforeTopicNum = topic.num;
  	document.getElementById('header').scrollIntoView({behavior: 'smooth'});
  	console.log(this.beforeTopicNum);
  }

  removeTopic(topicId, index) {
  	this.topicService.deleteTopic({id: topicId}).subscribe(result => {
  		this.topics.splice(index, 1);
  		this.topics.filter(topic => {
  			if (topic.num > index) {
  				topic.num -= 1;
  			}
  		});
  	});
  }

  deletePost(index, postIndex, postId) {
  	this.topics[index].feed.splice(postIndex, 1);
  	this.postService.deletePost({id: postId}).subscribe(result =>{ 

  	});
  }

  deleteArticle(index, articleIndex, articleId) {
    
    this.articleService.deleteArticle({id: articleId}).subscribe(result =>{ 
      this.deletePopup = 'hidden';
      this.deletePopupIndex = null;
      this.topics[index].feed.splice(articleIndex, 1);
    });
  }

  openLink(url, file) {
  	let fileUrl = url;
  	if (file) {
  		fileUrl =  "http://localhost:8000/" + url;
  	}
  	
  	window.open(fileUrl, '_blank');
  }

  goToTest(topicId, testworkId) {
  	// this.testworkService.sendEditTest(testwork);
  	if (this.userType === 'teacher') {
  		this.router.navigate(['../testAnswers'], {relativeTo: this.route, queryParams: { testworkId: testworkId } });
  	} else if (this.userType === 'student') {
  		this.router.navigate(['../testwork'], {queryParams: {testId: testworkId},relativeTo: this.route});
  	}
  }

  goToEditTest(topicId, testworkId) {
  	if (this.userType === 'teacher') {
  		this.router.navigate(['../add-testwork'], {relativeTo: this.route, queryParams: {topicId: topicId, testworkId: testworkId } });
  	}
  }

  goToTopic(id) {
    this.scrollEl = "topic" + id;
  }

  goToEditArticle(feedPost, topicId) {
    this.courseService.showArticle(feedPost, topicId);
    document.getElementById('header').scrollIntoView({ behavior: 'smooth' });
  }

  showAssignment(topic, assignmentId) {
  	this.courseService.showAssignment({topic: topic, assignmentId: assignmentId});
  	document.getElementById('header').scrollIntoView({ behavior: 'smooth' });	
  }

  showPost(topic) {
  	this.courseService.showPost(topic);
  	document.getElementById('header').scrollIntoView({ behavior: 'smooth' });	
  }

  showArticle(topic) {
    this.courseService.showArticle(null, topic);
    document.getElementById('header').scrollIntoView({ behavior: 'smooth' });    
  }

  showEditTopic(topic, i) {
  	this.editIndex = i;
  	this.editForm.patchValue({title: topic.title, hidden: topic.hidden});
  }

  topicMode() {
  	this.newTopicMode = !this.newTopicMode;
  }

  goUp() {
  	this.scrollEl = 'header';
  }

  goDown() {
  	let id = ("topic" + (this.topics.length-1));
  	this.scrollEl = id;
  }

  ngOnDestroy() {
  	this.sub.unsubscribe();
  	this.sub2.unsubscribe();
  	this.sub3.unsubscribe();
  }
}
