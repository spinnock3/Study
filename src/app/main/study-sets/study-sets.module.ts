import { NgModule } from '@angular/core';

import { StudySetsComponent } from './study-sets.component';
import { StudySetsRoutingModule } from './study-sets-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { StudyCardComponent } from './study-card/study-card.component';
import { StudySetComponent } from './study-set/study-set.component';
import { SetListComponent } from './set-list/set-list.component';
import { SetCardComponent } from './set-card/set-card.component'


@NgModule({
    imports: [
        StudySetsRoutingModule,
        SharedModule
    ],
    declarations: [
        StudySetsComponent,
        StudyCardComponent,
        StudySetComponent,
        SetListComponent,
        SetCardComponent
    ],
    entryComponents: [
        
    ],
    exports: [
       StudyCardComponent
    ],
    providers: [
    ],
})
export class StudySetsModule { }
