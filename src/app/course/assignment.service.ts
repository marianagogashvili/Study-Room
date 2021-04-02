import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AssignmentService {
	constructor(private http: HttpClient) {}

	createAssignment(param: Params) {
		return this.http.post(
			'http://localhost:8000/assignment/createAssignment', 
			param, {
				headers: new HttpHeaders({
					// 'Content-Type': 'application/json',
					'Accept': 'application/json',
					// 'Content-Type': 'multipart/form-data',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error);
			}));
	}

	addMargin(param: Params) {
		return this.http.post(
			'http://localhost:8000/assignment/addMargin', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error);
			}));
	}


	getAssignmentById(param: Params) {
		return this.http.post(
			'http://localhost:8000/assignment/getAssignmentById', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error);
			}));
	}

	updateAssignment(param: Params) {
		return this.http.post(
			'http://localhost:8000/assignment/editAssignment', 
			param, {
				headers: new HttpHeaders({
					// 'Content-Type': 'application/json',
					'Accept': 'application/json',
					// 'Content-Type': 'multipart/form-data',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error);
			}));
	}

	deleteAssignment(param: Params) {
		return this.http.post(
			'http://localhost:8000/assignment/deleteAssignment', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			}).pipe(catchError(error => {
				return throwError(error);
			}));
	}


}