import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AuthGuard } from './auth-guard.service';
import { AuthGuardTeacher } from './auth-guard-teacher.service';
import { AuthGuardStudent } from './auth-guard-student.service';

import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { EditComponent } from './student/edit/edit.component';
import { CourseComponent } from './course/course.component';
import { StudentsComponent } from './course/students/students.component';
import { MainComponent } from './course/main/main.component';
import { AddStudentComponent } from './course/add-student/add-student.component';
import { AssignmentComponent } from './course/assignment/assignment.component';
import { GradesComponent } from './student/grades/grades.component';
import { AssignmentsComponent } from './student/assignments/assignments.component';
import { MainStudentComponent } from './student/main-student/main-student.component';
import { GradebookComponent } from './course/gradebook/gradebook.component';
import { AddTestworkComponent } from './course/add-testwork/add-testwork.component';
import { TestworkComponent } from './course/testwork/testwork.component';
import { TestAnswersComponent } from './course/test-answers/test-answers.component';
import { GradeAnswersComponent } from './course/test-answers/grade-answers/grade-answers.component';
import { StudentRequestsComponent } from './course/student-requests/student-requests.component';

const appRoutes:Routes = [
	{ path: '', component: HomeComponent},
	{ path: 'search', component: SearchComponent},
	{ path: 'auth', component: AuthComponent },
	{ path: 'student', canActivate: [AuthGuardStudent], canActivateChild:[AuthGuardStudent], component: StudentComponent, children: [
		{ path: 'main', component: MainStudentComponent },
		{ path: 'grades', component: GradesComponent },
		{ path: 'assignments', component: AssignmentsComponent },
		
	]},
	{ path: 'teacher', canActivate: [AuthGuardTeacher], canActivateChild:[AuthGuardTeacher], component: TeacherComponent, children: [
		// { path: 'edit', component: EditComponent }
		// edit, grades
	]},
	{ path: 'course/:id' , canActivate: [AuthGuard], component: CourseComponent, children: [
		{ path: '', redirectTo: 'main', pathMatch: 'full'},
		{ path: 'students', canActivate: [AuthGuard], component:  StudentsComponent },
		{ path: 'main', canActivate: [AuthGuard], component:  MainComponent },
		{ path: 'add-student', canActivate: [AuthGuardTeacher], component:  AddStudentComponent },
		{ path: 'assignment/:assignmentId', canActivate: [AuthGuard], component:  AssignmentComponent },
		{ path: 'gradebook', canActivate: [AuthGuardStudent], component: GradebookComponent },
		{ path: 'add-testwork', canActivate: [AuthGuardTeacher], component: AddTestworkComponent },
		{ path: 'testwork', canActivate: [AuthGuard], component: TestworkComponent },
		{ path: 'testAnswers', canActivate: [AuthGuardTeacher], component: TestAnswersComponent, children: [
			{ path: 'gradeAnswers', canActivate: [AuthGuardTeacher], component: GradeAnswersComponent }
		] },
		{ path: 'student-requests', canActivate: [AuthGuardTeacher], component: StudentRequestsComponent },
		
	]}
];

@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule]
})

export class AppRoutingModule {

}