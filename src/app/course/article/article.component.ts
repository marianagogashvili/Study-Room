import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  article;
  loading = true;

  constructor(private articleService: ArticleService,
  			  private router: Router,
  			  private route: ActivatedRoute) { }

  ngOnInit() {
  	this.route.params.pipe(map(result => {
  		console.log(result['articleId']);

  		return result['articleId'];
  	}), mergeMap(id => {
  		return this.articleService.getArticle({id: id});
  	})).subscribe(article => {
  		this.article = article;
  		this.loading = false;
  		console.log(article);
  	});

  }

}
