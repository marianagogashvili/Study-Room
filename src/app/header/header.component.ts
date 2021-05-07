import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faUniversity } from '@fortawesome/free-solid-svg-icons';
import { faPuzzlePiece } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';

import { trigger, state, style, animate, transition } from '@angular/animations';

import { StudentService } from '../student/student.service';
import { TeacherService } from '../teacher/teacher.service';
import { TopicService } from '../course/topic.service';
import { HomeService } from '../home.service';

import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
  trigger('showHeader', [
      state('shown', style({
        transform: 'translateY(0px)',
        opacity: 1,
        visibility: 'visible',
      })),
      state('hidden', style({
        transform: 'translateY(100px)',
        opacity: 0,
        visibility: 'hidden',
      })),
      transition('shown <=> hidden', animate(200)),
    ]),
  trigger('showHeader2', [
    state('shown', style({
      display: 'block'
    })),
    state('hidden', style({
      display: 'none'
    })),
    transition('shown => hidden', animate('0ms 200ms')),
    transition('hidden => shown', animate('0ms ease')),

  ]),
  trigger('burgerChild1', [
      state('shown', style({
        transform: 'rotate(45deg) translateY(6px) translateX(5px)',
        width: "30px"
      })),
      state('hidden', style({
        transform: 'rotate(0) translateY(0) translateX(0)',
        width: "26px"
      })),
      transition('shown <=> hidden', animate(200)),
    ]),
   trigger('burgerChild2', [
      state('shown', style({
        width: '0px',
      })),
      state('hidden', style({
        width: '26px',
      })),
      transition('shown <=> hidden', animate(200)),
    ]),
    trigger('burgerChild3', [
      state('shown', style({
        transform: 'rotate(-45deg) translateY(-6px) translateX(5px)',
        width: "30px"
      })),
      state('hidden', style({
        transform: 'rotate(0) translateY(0) translateX(0)',
        width: "26px"
      })),
      transition('shown <=> hidden', animate(200)),
    ])
  ]
})
export class HeaderComponent implements OnInit {
  accountIcon = faUser;
  gradesIcon = faGraduationCap;
  editIcon = faEdit;
  aboutIcon = faAddressCard;
  logOutIcon = faDoorOpen;

  loading = true;
  displayHeader = false;
  showHeaderState = 'hidden';

  loggedIn = localStorage.getItem('token');
  
  courses; 
  showCourses;
  showTopics;
  courseTopics = null;
  
  notifications;
  unseenNotifs;

  openIcon = faAngleDown;
  closedIcon = faAngleRight;
  uniIcon = faUniversity;
  topicIcon = faPuzzlePiece;
  notifIcon = faBell;

  showNotifs = false;

  constructor(private router: Router,
              private studentService: StudentService,
              private teacherService: TeacherService,
              private route: ActivatedRoute,
              private topicService: TopicService,
              private homeService: HomeService) { }

  ngOnInit() {
    this.loading = false;
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: {type} = jwt_decode(token);

      if (decodedToken.type === 'student') {
        this.studentService.getStudent().subscribe((student: {courses}) => {
          this.courses = student.courses;
        }, error => {

        });
      } else {
        this.teacherService.getTeacher().subscribe((teacher: {courses}) => {
          this.courses = teacher.courses;

        }, error => {

        });
      }   
    }


    this.route.params.subscribe(params => {
      console.log(params['id']);
      if (params['id']) {
        this.topicService.getTopics({courseId: params['id']}).subscribe(topics => {
          this.courseTopics = topics;

        });
      }
    });

    this.homeService.getNotifications().subscribe((result: [{seen}]) => {
      console.log(result);
      let unseen = 0;
      result.forEach(val => unseen += val.seen === false ? 1 : 0);
      console.log(unseen);

      this.unseenNotifs = unseen;
      this.notifications = result;
    });

    if (this.displayHeader) {
     this.closeNav();
    }
  }

  toggleCourseList() {
    // this.openListState = this.openListState === 'shown' ? 'hidden' : 'shown';
    // console.log(this.openListState);
 
  }

  showNotifications() {
    if (this.showNotifs === false) {
      this.showNotifs = true;
      this.unseenNotifs = 0;
    } else {
      this.showNotifs = false;
    }
    
  }

  toTopic(id) {
    document.getElementById('topic' + id).scrollIntoView({ behavior: 'smooth' });
  }

  logOut() {
    this.router.navigate(['/auth']);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiryDate');
  }

  logIn() {
    this.router.navigate(['/auth']);
  }

  onShowHeader() {
    this.displayHeader = !this.displayHeader;
    this.showHeaderState = this.showHeaderState === 'hidden' ? 'shown': 'hidden';
  }

  
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    let element = document.getElementById("main");
    element.style.marginLeft= "250px";
    element.style.webkitTransitionDuration = "0.5s";
    element.style.webkitTransitionTimingFunction = "ease-out";

    let element2 = document.getElementById("main2");
    element2.style.marginLeft= "250px";
    element2.style.webkitTransitionDuration = "0.5s";
    element2.style.webkitTransitionTimingFunction = "ease-out";

  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    let element = document.getElementById("main");
    element.style.marginLeft= "0";
    element.style.webkitTransitionDuration = "0.3s";
    element.style.webkitTransitionTimingFunction = "ease-out";

    let element2 = document.getElementById("main2");
    element2.style.marginLeft= "0";
    element2.style.webkitTransitionDuration = "0.3s";
    element2.style.webkitTransitionTimingFunction = "ease-out";

  }
}
