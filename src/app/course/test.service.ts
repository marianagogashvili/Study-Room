import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { throwError, BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class TestService {
	studentsAnswers = new BehaviorSubject<string>(null);
	constructor(private http: HttpClient) {}

	createTestwork(param: Params) {
		return this.http.post(
			'http://localhost:8000/testwork/createTest', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	addMargin(param: Params) {
		return this.http.post(
			'http://localhost:8000/testwork/addMargin', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	updateTestwork(param: Params) {
		return this.http.post(
			'http://localhost:8000/testwork/updateTest', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	deleteTestwork(param: Params) {
		return this.http.post(
			'http://localhost:8000/testwork/deleteTest', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}


	getTestwork(param: Params) {
		return this.http.post(
			'http://localhost:8000/testwork/getTest', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	saveAnswers(param: Params) {
		return this.http.post(
			'http://localhost:8000/testAnswer/saveAnswers', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	getAnswers(param: Params) {
		return this.http.post(
			'http://localhost:8000/testAnswer/getAnswers', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	updateAnswers(param: Params) {
		return this.http.post(
			'http://localhost:8000/testAnswer/updateAnswers', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	getAnswersForTeacher(param: Params) {
		return this.http.post(
			'http://localhost:8000/testAnswer/getAnswersForTeacher', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	sendAnswers(answers) {
		this.studentsAnswers.next(answers);
	}

	// sendEditTest(testwork) {
	// 	this.testwork.next(testwork);
	// }
}