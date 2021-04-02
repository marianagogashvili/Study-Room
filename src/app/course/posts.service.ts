import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Params } from '@angular/router';
import { throwError, BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
	constructor(private http: HttpClient) {}

	createPost(param: Params) {
		return this.http.post(
			'http://localhost:8000/post/createPost', 
			param, {
				headers: new HttpHeaders({
					'Accept': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}


	addMargin(param: Params) {
		return this.http.post(
			'http://localhost:8000/post/addMargin', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	getPostsByCourse(param: Params) {
		return this.http.post(
			'http://localhost:8000/post/getPostsByCourse', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}

	deletePost(param: Params) {
		return this.http.post(
			'http://localhost:8000/post/deletePost', 
			JSON.stringify(param), {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}
}