import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AuthGuard } from './auth-guard.service';
import { AuthGuardTeacher } from './auth-guard-teacher.service';
import { AuthGuardStudent } from './auth-guard-student.service';

import { HomeComponent } from './home/home.component';
import { DatePipe } from '@angular/common';
import { EditComponent } from './student/edit/edit.component';
import { EditTeacherComponent } from './teacher/edit-teacher/edit-teacher.component';
import { CourseComponent } from './course/course.component';
import { AddCourseComponent } from './teacher/add-course/add-course.component';
import { StudentsComponent } from './course/students/students.component';
import { MainComponent } from './course/main/main.component';
import { AddStudentComponent } from './course/add-student/add-student.component';
import { AddAssignmentComponent } from './course/add-assignment/add-assignment.component';
import { AssignmentComponent } from './course/assignment/assignment.component';
import { SolutionComponent } from './course/assignment/solution/solution.component';
import { SolutionsComponent } from './course/assignment/solutions/solutions.component';
import { AddPostComponent } from './course/add-post/add-post.component';
import { GradesComponent } from './student/grades/grades.component';
import { AssignmentsComponent } from './student/assignments/assignments.component';
import { MainStudentComponent } from './student/main-student/main-student.component';
import { GradebookComponent } from './course/gradebook/gradebook.component';
import { AddTestworkComponent } from './course/add-testwork/add-testwork.component';
import { TestworkComponent } from './course/testwork/testwork.component';
import { TestAnswersComponent } from './course/test-answers/test-answers.component';
import { GradeAnswersComponent } from './course/test-answers/grade-answers/grade-answers.component';
import { SearchComponent } from './search/search.component';
import { StudentRequestsComponent } from './course/student-requests/student-requests.component';
import { AddArticleComponent } from './course/add-article/add-article.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    StudentComponent,
    TeacherComponent,
    HomeComponent,
    EditComponent,
    EditTeacherComponent,
    CourseComponent,
    AddCourseComponent,
    StudentsComponent,
    MainComponent,
    AddStudentComponent,
    AddAssignmentComponent,
    AssignmentComponent,
    SolutionComponent,
    SolutionsComponent,
    AddPostComponent,
    GradesComponent,
    AssignmentsComponent,
    MainStudentComponent,
    GradebookComponent,
    AddTestworkComponent,
    TestworkComponent,
    TestAnswersComponent,
    GradeAnswersComponent,
    SearchComponent,
    StudentRequestsComponent,
    AddArticleComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe, AuthGuard, CookieService, AuthGuardTeacher, AuthGuardStudent, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
