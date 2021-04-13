import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class HomeService {
	constructor(private http: HttpClient) {}

	getGroups() {
		return this.http.get('http://localhost:8000/group/getGroups');
	}

	getFields() {
		return this.http.get(
			'http://localhost:8000/field/getFields');
	}

	getNotifications() {
		return this.http.get(
			'http://localhost:8000/auth/getNotifications', {
				headers: new HttpHeaders({
					'Content-Type': 'application/json',
					Authorization: 'Bearer ' + localStorage.getItem('token')
				})
			});
	}



}