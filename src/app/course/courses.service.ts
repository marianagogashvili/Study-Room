import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject, Subject } from 'rxjs';
import jwt_decode from "jwt-decode";

@Injectable({providedIn: 'root'})
export class CoursesService {
	constructor(private http: HttpClient) {
		this.checkType();
	}
	assignmentMode = new EventEmitter();
	postMode = new EventEmitter();
	articleMode = new EventEmitter();
	folderMode = new EventEmitter();

	feedValue = new Subject<any>(); 

	error = new BehaviorSubject<string>(null);
	oldStudents = new BehaviorSubject<any>(null);
	userType = new BehaviorSubject<any>(null);
	allowedUser = new BehaviorSubject<any>(null);

	courseId;

	checkType() {
		const decodedToken: {type, id} = jwt_decode(localStorage.getItem('token'));
		this.userType.next({type: decodedToken.type, uid: decodedToken.id});  
	}

	getFeed(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/getFeed', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error.error);
			}));
	}

	getGrades(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/getGrades', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error.error);
			}));
	}

	getCourse(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/getCourse', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error.error);
			}));
	}

	editCourse(param: Params) {
		return this.http.put(
			'http://localhost:8000/course/editCourse', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error.error);
			}));
	}

	// getStudentsOfCourse(param: Params) {
	// 	return this.http.post(
	// 		'http://localhost:8000/course/getStudentsOfCourse', 
	// 		JSON.stringify(param), {
	// 			headers: new HttpHeaders({
	// 				'Content-Type': 'application/json',
	// 				Authorization: 'Bearer ' + localStorage.getItem('token')
	// 			})
	// 		});
	// }

	acceptStudent(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/acceptStudent', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	deleteStudentFromCourse(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/deleteStudentFromCourse', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	findStudents(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/findStudentsByParams', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	addStudentsToCourse(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/addStudents', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	
	acceptAllStudents(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/acceptAllStudents', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}


	deleteAllStudents(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/deleteStudents', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	deleteCourse(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/deleteCourse', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	getAllCourses() {
		return this.http.get(
			'http://localhost:8000/course/getAll');
	}

	searchCourses(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/search', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	registerStudent(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/registerStudent', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	sendStudentRequest(param: Params) {
		return this.http.post(
			'http://localhost:8000/course/sendStudentRequest', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	sendStudentsToSelf(students) {
		this.oldStudents.next(students);
	}

	sendError(err) {
		this.error.next(err);
	}

	showAssignment(val) {
		this.assignmentMode.emit(val);
	}

	showPost(value, topicId) {
		this.postMode.emit({value, topicId});
	}

	showArticle(value, topicId) {
		this.articleMode.emit({value, topicId});
	}

	showFolder(topic) {
		this.folderMode.emit(topic);
	}

	sendNewFeedPost(val) {
		this.feedValue.next(val);
	}

	sendAllowedUser(type) {
		this.allowedUser.next(type);
	}


}