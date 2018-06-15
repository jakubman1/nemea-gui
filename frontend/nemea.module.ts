import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgGridModule } from 'angular2-grid';

//import { CodemirrorModule } from 'ng2-codemirror';

/**
  * ngx charts
  */
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthGuard } from 'app/utils/auth.guard';
import { IdeaPipe } from './events/idea.pipe';

import { NemeaBaseComponent, NemeaComponent } from './nemea.component';

/**
  * NEMEA Events
  */
import { EventsComponent } from './events/events.component';
import { EventItemComponent } from './events/event-item/event-item.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { SafePipe, SafePipeModule } from 'app/utils/safe.pipe';

/**
  * NEMEA Dashboard
  */
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashBoxComponent } from './dashboard/dash-box/dash-box.component';
import { DashBoxModalComponent } from './dashboard/dash-box-modal/dash-box-modal.component';
import { DashboardViewComponent } from './dashboard/dashboard-view/dashboard-view.component';
import { DashModalComponent } from './dashboard/dash-modal/dash-modal.component';

/**
  * NEMEA Reporter Configuration
  */
import { NemeaReporterConfComponent } from './reporter/reporter_conf.component';
import { MarkActionComponent } from './reporter/actions/mark-action/mark-action.component';
import { FileActionComponent } from './reporter/actions/file-action/file-action.component';
import { MongoActionComponent } from './reporter/actions/mongo-action/mongo-action.component';
import { EmailActionComponent } from './reporter/actions/email-action/email-action.component';
import { TrapActionComponent } from './reporter/actions/trap-action/trap-action.component';
import { WardenActionComponent } from './reporter/actions/warden-action/warden-action.component';

/**
  * NEMEA Status
  */
import { NemeaStatusComponent } from './status/nemea_status.component';

/**
  * NEMEA Supervisor GUI
  */
import {SupervisorGuiComponent} from "./supervisor/supervisor-gui.component";
import {NsgModulesListingComponent} from "./supervisor/pages/nsg-modules-listing/nsg-modules-listing.component";
import {NsgModulesNewComponent} from "./supervisor/pages/nsg-module-new/nsg-module-new.component";
import {NsgModuleDetailComponent} from "./supervisor/pages/nsg-module-detail/nsg-module-detail.component";
import {NsgInstancesListingComponent} from "./supervisor/pages/nsg-instances-listing/nsg-instances-listing.component";
import {NsgInstancesNewComponent} from "./supervisor/pages/nsg-instance-new/nsg-instance-new.component";
import {NsgInstanceDetailComponent} from "./supervisor/pages/nsg-instance-detail/nsg-instance-detail.component";
import {NsgHowToComponent} from "./supervisor/pages/nsg-how-to/nsg-how-to.component";

import {NsgTabsComponent} from "./supervisor/pages/shared/nsg-tabs/nsg-tabs.component";
import {NsgTabComponent} from "./supervisor/pages/shared/nsg-tab/nsg-tab.component";
import {NsgModuleEditComponent} from "./supervisor/pages/nsg-module-edit/nsg-module-edit.component";
import {NsgInstanceEditComponent} from "./supervisor/pages/nsg-instance-edit/nsg-instance-edit.component";
import {NsgInterfacesFormComponent} from "./supervisor/pages/nsg-instance-edit/nsg-interfaces-form/nsg-interfaces-form.component";


const nemeaRoutes: Routes = [
    {
        path : 'nemea',
        component : NemeaBaseComponent,
        canActivate : [AuthGuard],
        data : {
            basepath : true,
            name : 'NEMEA',
            description : 'System for network traffic analysis and anomaly detection.',
            icon : 'fa-grav',
            img : 'path/to/img',
            role : 10
        },
        children : [
            {
                path : '',
                component: NemeaComponent,
                canActivate : [AuthGuard],
                data : {
                    role : 10,
                    label: ''
                }
            },
            {
                path : 'supervisor-gui',
                component: SupervisorGuiComponent,
                canActivate : [AuthGuard],
                data : {
                    role : 10,
                    label: 'Supervisor GUI'
                },
                children: SupervisorGuiComponent.childrenRoutes
            },
            {
                path : 'status',
                component: NemeaStatusComponent,
                canActivate : [AuthGuard],
                data : {
                    role : 10,
                    label: 'Status'
                }
            },
            {
                path : 'events',
                component: EventsComponent,
                canActivate : [AuthGuard],
                data : {
                    role : 10,
                    label: 'Events'
                }
            },
            {
                path : 'dashboard',
                component : DashboardComponent,
                canActivate : [AuthGuard],
                data : {
                    role : 255,
                    label: 'Dashboard'
                }
            },
            {
                path : 'reporters',
                component: NemeaReporterConfComponent,
                canActivate : [AuthGuard],
                data : {
                    role : 10,
                    label: 'Reporters'
                }
            }
        ]
    }
];

@NgModule({
    imports : [
        CommonModule,
        FormsModule,
        SafePipeModule,
        NgGridModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        NgbModule.forRoot(),
        RouterModule.forChild(nemeaRoutes)
    ],
    declarations : [
        IdeaPipe,
        NemeaBaseComponent,
        NemeaComponent,

        NemeaStatusComponent,
        NemeaReporterConfComponent,

        SupervisorGuiComponent,
        NsgInstancesListingComponent,
        NsgInstancesNewComponent,
        NsgInstanceDetailComponent,
        NsgModulesListingComponent,
        NsgModulesNewComponent,
        NsgModuleDetailComponent,
        NsgHowToComponent,
        NsgModuleEditComponent,
        NsgInstanceEditComponent,
        NsgInterfacesFormComponent,
        NsgTabsComponent,
        NsgTabComponent,

        EventsComponent,
        EventItemComponent,
        EventDetailComponent,

        DashboardComponent,
        DashBoxModalComponent,
        DashBoxComponent,
        DashboardViewComponent,
        DashModalComponent,
        MarkActionComponent,
        FileActionComponent,
        MongoActionComponent,
        EmailActionComponent,
        TrapActionComponent,
        WardenActionComponent
    ],
    exports : [],
    providers : [SafePipe],
    entryComponents : [
        EventDetailComponent,
        DashBoxModalComponent,
        DashModalComponent
    ]
})
export class NemeaModule {}
