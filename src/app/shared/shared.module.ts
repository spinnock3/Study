import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FuseWidgetModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

//Angular material module
import { MaterialModule } from '../material/material.module';

import { AddSetDialogComponent } from './dialogs/add-set-dialog/add-set-dialog.component';
import { AddExamDialogComponent } from './dialogs/add-exam-dialog/add-exam-dialog.component';



@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FuseSharedModule,
        FuseWidgetModule
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        BrowserModule,
        BrowserAnimationsModule,
        FuseSharedModule,
        FuseWidgetModule,
        AddSetDialogComponent,
        AddExamDialogComponent
    ],
    declarations: [AddSetDialogComponent, AddExamDialogComponent],
    entryComponents: [AddSetDialogComponent, AddExamDialogComponent],
    providers: [
    ],
})
export class SharedModule { }
