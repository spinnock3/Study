import { NgModule } from '@angular/core';

import { ExamsComponent } from './exams.component';
import { ExamsRoutingModule } from './exams-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ExamCardComponent } from './exam-card/exam-card.component';
import { CalendarModule } from 'angular-calendar';


@NgModule({
    imports: [
        ExamsRoutingModule,
        SharedModule,
        CalendarModule
    ],
    declarations: [
        ExamsComponent,
        ExamCardComponent
    ],
    entryComponents: [
    ],
    exports: [
       
    ],
    providers: [
    ],
})
export class ExamsModule { }
