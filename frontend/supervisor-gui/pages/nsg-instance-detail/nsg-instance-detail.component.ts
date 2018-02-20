import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInterface} from "../../models/nsg-interface";
import {NsgInstance} from "../../models/nsg-instance";
import {NsgInstanceEditPlainFormComponent} from "../shared/nsg-edit/plain/instance/nsg-instance-edit-plain-form.component";
import {NsgInstanceEditJsonFormComponent} from "../shared/nsg-edit/json/instance/nsg-instance-edit-json-form.component";

@Component({
    selector: 'nsg-instance-detail',
    templateUrl: './nsg-instance-detail.component.html',
    styleUrls: ['./nsg-instance-detail.component.scss'],
    providers: [NsgInstancesService]
})
export class NsgInstanceDetailComponent implements OnInit {

    @ViewChild(NsgInstanceEditPlainFormComponent)
    private plainFormComponent: NsgInstanceEditPlainFormComponent;
    @ViewChild(NsgInstanceEditJsonFormComponent)
    private jsonFormComponent: NsgInstanceEditJsonFormComponent;

    nsgInstance: NsgInstance;
    selectedIfc: NsgInterface;
    instanceNotFound = false;

    constructor(private nsgInstancesService: NsgInstancesService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        const instName = this.route.snapshot.paramMap.get('instance');
        this.nsgInstancesService.getInstance(instName).subscribe(
            (inst) => {
                console.log('Received instance:');
                console.log(JSON.stringify(inst));
                this.nsgInstance = inst;
                if (this.nsgInstance.in_ifces.length > 0) {
                    this.selectedIfc = this.nsgInstance.in_ifces[0];
                } else if (inst.out_ifces.length > 0) {
                    this.selectedIfc = this.nsgInstance.out_ifces[0];
                } else {
                    this.selectedIfc = undefined;
                }

                console.log(this.nsgInstance);
            },
            (error) => {
                if (error.status == 404) {
                    console.log('Service: instance not found');
                    this.instanceNotFound = true;
                } else {
                    console.log('Service error: ');
                    console.log(error);
                    //TODO
                }
            }
        );
    }

    onChildSaved(inst: NsgInstance) {
        console.log('onChildSaved in detail');
        console.log(inst);
        this.nsgInstance = inst;

        // update default values in both children
        this.plainFormComponent.passedInstance = this.nsgInstance;
        this.plainFormComponent.resetForm();
        this.jsonFormComponent.passedInstance = this.nsgInstance;
        this.jsonFormComponent.resetForm();
    }

    onChildEdited(inst: NsgInstance) {
        console.log('onChildEdited in detail');
        console.log(inst);

        // Edit working values of both forms
        this.plainFormComponent.nsgInstance = inst;
        this.plainFormComponent.fetchModule();
        this.jsonFormComponent.nsgInstanceJson = inst.apiJson();
        this.jsonFormComponent.beautifyJson();
    }

    removeInstance() {
        this.nsgInstancesService.removeInstance(this.nsgInstance.name).subscribe(
            () => {
                this.router.navigate(['/nemea/supervisor-gui/instances'])
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

    removeInterface(ifc: NsgInterface) {
        this.nsgInstancesService.removeInterface(this.nsgInstance.name, ifc.name).subscribe(
            () => {
                const ifcFilter = (ifcIter) => ifcIter != ifc;
                if (ifc.direction == 'IN') {
                    this.nsgInstance.in_ifces = this.nsgInstance.in_ifces.filter(ifcFilter);
                } else {
                    this.nsgInstance.out_ifces = this.nsgInstance.out_ifces.filter(ifcFilter);
                }

                console.log(`interface ${ifc.name} deleted`);
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

    selectInterface(ifc: NsgInterface) {
        this.selectedIfc = ifc;
    }

}
