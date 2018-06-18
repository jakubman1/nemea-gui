import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NsgModule} from "../../models/nsg-module";
import {NsgModulesService} from "../../services/nsg-modules.service";
import {NsgModal} from "../../services/nsg-modal.service";
import {ErrParserService} from "../../services/err-parser.service";

@Component({
    selector: 'nsg-module-edit',
    templateUrl: './nsg-module-edit.component.html',
    styleUrls: ['./nsg-module-edit.component.scss'],
    providers: [NsgModulesService, NsgModal, ErrParserService]
})
export class NsgModuleEditComponent implements OnInit {


    /* Module to be changed */
    @Input() passedModule: NsgModule;

    /* Whether this component is used for editing
     * existing instance or creating new one */
    @Input() isEditForm: boolean;

    /* Both are used to notify detail component */
    @Output() onChildSaved = new EventEmitter<NsgModule>();
    @Output() onChildEdited = new EventEmitter<NsgModule>();

    nsgModule: NsgModule; // NsgModule model that is currently edited
    backendErrors: any[];

    constructor(private nsgModalService: NsgModal,
                private nsgModulesService: NsgModulesService,
                private router: Router,
                private errParser: ErrParserService) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.resetForm();
    }

    resetForm() {
        this.nsgModule = new NsgModule(JSON.parse(JSON.stringify(this.passedModule))); //TODO: FIX THIS
    }

    onSubmit() {
        console.log('submitting module');
        this.backendErrors = [];
        if (this.isEditForm) {
            console.log('updating module');
            this.nsgModulesService.updateModule(this.passedModule.name, this.nsgModule).subscribe(
                (module) => {
                    this.onChildSaved.emit(this.nsgModule);
                    this.router.navigate([`/nemea/supervisor-gui/modules/${this.nsgModule.name}`], {fragment: 'info'})
                },
                (error) => {
                    console.log('Failed to update module:');
                    console.log(error);
                    this.backendErrors = this.errParser.toArr(error['error']['message']);
                }
            );
        } else {
            this.nsgModulesService.createModule(this.nsgModule).subscribe(
                (module) => {
                    this.onChildSaved.emit(this.nsgModule);
                    this.router.navigate([`/nemea/supervisor-gui/modules/${this.nsgModule.name}`], {fragment: 'info'})
                },
                (error) => {
                    console.log('Failed to create module:');
                    console.log(error);
                    this.backendErrors = this.errParser.toArr(error['error']['message']);
                }
            );
        }
    }

    onFormEdit(form) {
        if (form.valid && !form.submitted) {
            this.onChildEdited.emit(this.nsgModule);
        }
    }
}
