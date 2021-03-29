import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { AddArticleComponent } from './add-article.component';


@Injectable()
export class CanDeactivateGuard implements CanDeactivate<AddArticleComponent> {
  canDeactivate(component: AddArticleComponent): boolean {
   
    // if(component === false && component.article !== ''){
    //     if (confirm("You have unsaved changes! If you leave, your changes will be lost.")) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    return true;
  }
}