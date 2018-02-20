import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NsgInstancesService} from "../../../../../services/nsg-instances.service";
import {NsgInstance} from "../../../../../models/nsg-instance";
import {NsgYangModel} from "../../../../../models/nsg-yang-model";
import {NsgYangService} from "../../../../../services/nsg-yang.service";

import {NsgModulesService} from "../../../../../services/nsg-modules.service";
import {NsgInterface} from "../../../../../models/nsg-interface";
import {NsgModule} from "../../../../../models/nsg-module";
import {NsgModal} from "../../../../../services/nsg-modal.service";
import {NsgInterfacesFormComponent} from "./nsg-interfaces-form/nsg-interfaces-form.component";

@Component({
  selector: 'nsg-instance-edit-plain-form',
  templateUrl: './nsg-instance-edit-plain-form.component.html',
  styleUrls: ['./nsg-instance-edit-plain-form.component.scss'],
  providers: [NsgInstancesService, NsgModulesService, NsgModal]
})
export class NsgInstanceEditPlainFormComponent implements OnInit {
    /* Instance to be changed */
    @Input() passedInstance: NsgInstance;

    /* Whether this component is used for editing
     * existing instance or creating new one */
    @Input() isEditForm: boolean;

    /* Both are used to notify detail component
     * to update data in JSON tab */
    @Output() onChildSaved = new EventEmitter<NsgInstance>();
    @Output() onChildEdited = new EventEmitter<NsgInstance>();

    /* Allows to send information about changes of
     * passed instance or module*/
    @ViewChild(NsgInterfacesFormComponent)
    private ifcesFormComponent: NsgInterfacesFormComponent;

    /* NsgInstance model that is currently edited */
    nsgInstance: NsgInstance;
    /* Error received over HTTP */
    backendErrors: string[];
    /* Values for HTML <select> with id=moduleName */
    nsgModulesList: NsgModule[];

    /* Selected instance name to prefill from*/
    prefillInstName: string;
    /* List of instance names for prefill form*/
    nsgInstsNamesList: string[];

    constructor(private nsgModalService: NsgModal,
                private nsgInstancesService: NsgInstancesService,
                private nsgModulesService: NsgModulesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.resetForm();
        this.fetchModule();
        this.nsgModulesService.getAllModules().subscribe(
            (nsgModules) => {
                this.nsgModulesList = nsgModules;
            },
            (error) => {
                console.log('Error fetching modules list:');
                console.log(error);
                // TODO
            }
        );
        this.nsgInstancesService.getAllInstancesNames().subscribe(
            (data) => {
                this.nsgInstsNamesList = data;
            },
            (error) => {
                console.log('Error fetching instances names list:');
                console.log(error);
                // TODO
            }
        );
    }

    /* Loads details of instance module, serves for
     * interface component to gather IfcesTodo counts */
    fetchModule() {
        if (this.nsgInstance.nsgModule.name === undefined) {
            return;
        }
        this.nsgModulesService.getModule(this.nsgInstance.nsgModule.name).subscribe(
            (nsgModule) => {
                this.nsgInstance.nsgModule = nsgModule;
                this.nsgInstance.countIfcesTodo();
            },
            (error) => {
                console.log('Error fetching instance module:');
                console.log(error);
                // TODO
            }
        );
    }

    resetForm() {
        this.nsgInstance = new NsgInstance(JSON.parse(JSON.stringify(this.passedInstance)));
    }

    prefill() {
        this.nsgInstancesService.getInstance(this.prefillInstName).subscribe(
            (data) => {
                this.nsgInstance = data;
                this.nsgModalService.closeNsgModal();
            },
            (error) => {
                console.log('Error getting instance for prefill:');
                console.log(error);
                // TODO onError
            }
        );
    }

    onSubmit() {
        console.log('submitting instance');
        let onSuccess = () => {
            this.onChildSaved.emit(this.nsgInstance);
            this.router.navigate([`/nemea/supervisor-gui/instances/${this.nsgInstance.name}`], {fragment: 'info'})
        };
        let onError = (error) => {
            console.log(error);
            this.backendErrors = error.json();
        };

        if (this.isEditForm) {
            console.log('updating instance');
            this.nsgInstancesService.updateInstance(
                this.passedInstance.name,
                this.nsgInstance
            ).subscribe(onSuccess, onError);
        } else {
            console.log('creating instance');
            this.nsgInstancesService.createInstance(
                this.nsgInstance
            ).subscribe(onSuccess, onError);
        }
    }

    /* Messages current form values to JSON edit tab
     * through detail component (parent) */
    onFormEdit(form) {
        if (form.valid && !form.submitted) {
            console.log('sending form edit from plain');
            this.onChildEdited.emit(this.nsgInstance);
        }
    }

    ifcesEdited(event) {
        this.onChildEdited.emit(this.nsgInstance);
    }


    tryPrefillInstNameAndFetch(moduleName) {
        this.fetchModule();
        moduleName = moduleName.value;
        if (moduleName.length > 0 && this.nsgInstance.name.length == 0) {
            if (this.nsgInstsNamesList.length > 0) {
                try {
                    let others = this.nsgInstsNamesList.filter(
                        x => x.match(new RegExp('^' + moduleName + '[0-9]*'))
                    );
                    let lastOther = others.length - 1;
                    let lastNum = others.sort()[lastOther].match(/[0-9]*$/);
                    if (lastNum.length > 0) {
                        this.nsgInstance.name = lastOther.substring(lastNum[1]) + (parseInt(lastNum[0]) + 1).toString();
                    }
                } catch (e) {
                    this.nsgInstance.name = moduleName + '1';
                }
            }
        }
    }
}
