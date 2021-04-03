import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject, Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ArticleService {
	constructor(private http: HttpClient) {}

	closeArticle = new BehaviorSubject<string>(null);

	createArticle(param: Params) {
		return this.http.post(
			'http://localhost:8000/article/createArticle', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	addMargin(param: Params) {
		return this.http.post(
			'http://localhost:8000/article/addMargin', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	updateArticle(param: Params) {
		return this.http.post(
			'http://localhost:8000/article/updateArticle', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	deleteArticle(param: Params) {
		return this.http.post(
			'http://localhost:8000/article/deleteArticle', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	getArticle(param: Params) {
		return this.http.post(
			'http://localhost:8000/article/getArticle', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			})
	}

	closePopup() {
		this.closeArticle.next("close");
	}
}