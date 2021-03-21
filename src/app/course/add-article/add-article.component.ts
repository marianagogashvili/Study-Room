import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  @Input() topicId;
  @Input() courseId;
  constructor() { }

  ngOnInit() {
  }

}
