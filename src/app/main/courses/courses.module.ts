import { NgModule } from '@angular/core';

import { CoursesComponent } from './courses.component';
import { CoursesRoutingModule } from './courses-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CourseCardComponent } from './course-card/course-card.component';
import { NewCourseDialogComponent } from './dialogs/new-course-dialog/new-course-dialog.component';
import { EditCourseDialogComponent } from './dialogs/edit-course-dialog/edit-course-dialog.component';
import { CalendarModule } from 'angular-calendar';


@NgModule({
    imports: [
        CoursesRoutingModule,
        SharedModule,
        CalendarModule
    ],
    declarations: [
        CoursesComponent,
        CourseCardComponent,
        NewCourseDialogComponent,
        EditCourseDialogComponent
    ],
    entryComponents: [
        NewCourseDialogComponent,
        EditCourseDialogComponent
    ],
    exports: [
       
    ],
    providers: [
    ],
})
export class CoursesModule { }
