import { NgModule } from '@angular/core';

import { StudySessionComponent } from './study-session.component';
import { StudySessionRoutingModule } from './study-session-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { StudySetsModule } from '../study-sets/study-sets.module';

@NgModule({
    imports: [
        StudySessionRoutingModule,
        StudySetsModule,
        SharedModule
    ],
    declarations: [
        StudySessionComponent
    ],
    entryComponents: [
        
    ],
    exports: [
       
    ],
    providers: [
    ],
})
export class StudySessionModule { }
