import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInstance} from "../../models/nsg-instance";
import {NsgModulesService} from "../../services/nsg-modules.service";
import {NsgModule} from "../../models/nsg-module";
import {NsgModal} from "../../services/nsg-modal.service";
import {NsgInterfacesFormComponent} from "./nsg-interfaces-form/nsg-interfaces-form.component";
import {ErrParserService} from "../../services/err-parser.service";

@Component({
  selector: 'nsg-instance-edit',
  templateUrl: './nsg-instance-edit.component.html',
  styleUrls: ['./nsg-instance-edit.component.scss'],
  providers: [NsgInstancesService, NsgModulesService, NsgModal, ErrParserService]
})
export class NsgInstanceEditComponent implements OnInit {
    /* Instance to be changed */
    @Input() passedInstance: NsgInstance;

    /* Whether this component is used for editing
     * existing instance or creating new one */
    @Input() isEditForm: boolean;

    /* Both are used to notify detail component */
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

    /* List of instance `s to copy values from*/
    nsgInstsNamesList: string[];

    constructor(private nsgModalService: NsgModal,
                private nsgInstancesService: NsgInstancesService,
                private nsgModulesService: NsgModulesService,
                private router: Router,
                private errParser: ErrParserService) {
        this.backendErrors = [];
        this.nsgInstsNamesList = [];
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
                this.backendErrors = this.errParser.toArr(error);
            }
        );
        this.nsgInstancesService.getAllInstancesNames().subscribe(
            (data) => {
                this.nsgInstsNamesList = data;
            },
            (error) => {
                console.log('Error fetching instances names list:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    fetchModule() {
        if (this.nsgInstance.nsgModule.name === undefined) {
            return;
        }
        this.backendErrors = [];
        this.nsgModulesService.getModule(this.nsgInstance.nsgModule.name).subscribe(
            (nsgModule) => {
                this.nsgInstance.nsgModule = nsgModule;
            },
            (error) => {
                console.log('Error fetching instance module:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    resetForm() {
        this.nsgInstance = new NsgInstance(JSON.parse(JSON.stringify(this.passedInstance)));
    }

    onSubmit() {
        this.backendErrors = [];
        let onSuccess = () => {
            this.onChildSaved.emit(this.nsgInstance);
            this.router.navigate([`/nemea/supervisor-gui/instances/${this.nsgInstance.name}`], {fragment: 'info'})
        };
        let onError = (error) => {
            console.log(error);
            this.backendErrors = this.errParser.toArr(error);
        };

        if (this.isEditForm) {
            this.nsgInstancesService.updateInstance(
                this.passedInstance.name,
                this.nsgInstance
            ).subscribe(onSuccess, onError);
        } else {
            this.nsgInstancesService.createInstance(
                this.nsgInstance
            ).subscribe(onSuccess, onError);
        }
    }

    /* Messages current form values to JSON edit tab
     * through detail component (parent) */
    onFormEdit(form) {
        if (form.valid && !form.submitted) {
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
                    let lastNum = others[others.length - 1].match(/[0-9]*$/);
                    if (lastNum.length > 0) {
                        this.nsgInstance.name = moduleName + (parseInt(lastNum[0]) + 1).toString();
                    }
                } catch (e) {
                    this.nsgInstance.name = moduleName + '1';
                }
            }
        }
    }
}
