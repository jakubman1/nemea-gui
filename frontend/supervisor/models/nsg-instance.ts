import {NsgModule} from "./nsg-module";
import {NsgInterface} from "./nsg-interface";

export class NsgInstance {
    name: string;
    nsgModule: NsgModule;
    running: boolean;
    enabled: boolean;
    use_sysrepo: boolean;
    max_restarts_per_min: number;
    params?: string;

    in_ifces: NsgInterface[];
    out_ifces: NsgInterface[];

    restarting = false; // serves to tell that instance's status is being changed

    constructor(fields: any) {
        console.log('instance constructor');
        if (fields['in_ifces']) {
            fields['in_ifces'] = fields['in_ifces'].map(i => new NsgInterface(i));
        }
        if (fields['out_ifces']) {
            fields['out_ifces'] = fields['out_ifces'].map(i => new NsgInterface(i));
        }
        console.log(fields);
        Object.assign(this, fields);
        //this.nsgModule = fields.module;
    }

    addIfc(ifc: NsgInterface) {
        if (ifc.direction == 'IN') {
            this.in_ifces.push(ifc);
        } else {
            this.out_ifces.push(ifc);
        }
    }

    removeIfc(ifc: NsgInterface) {
        let ifces = ifc.direction == 'IN' ? this.in_ifces : this.out_ifces;
        for (let i = 0; i < ifces.length; i++) {
            if (ifc.name == ifces[i].name) {
                ifces.splice(i, 1);
                return;
            }
        }
    }

    apiJson(): string {
        let ifces = JSON.parse(JSON.stringify(this.in_ifces.concat(this.out_ifces)));
        console.log('api json')
        console.log(ifces);
        ifces = ifces.map(i => (new NsgInterface(i)).apiJsonObj())
        console.log(ifces);

        return JSON.stringify(
            {
                name: this.name,
                'module-ref': this.nsgModule.name,
                enabled: this.enabled,
                "use-sysrepo": this.use_sysrepo,
                "max-restarts-per-min": this.max_restarts_per_min,
                params: this.params,
                'interface': ifces
            }
        );
    }

    static newFromApi(obj) {
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        obj['nsgModule'] = new NsgModule({
            name: obj['module-ref']
        });
        obj['in_ifces'] = [];
        obj['out_ifces'] = [];

        if ('max-restarts-per-min' in obj) {
            obj['max_restarts_per_min'] = obj['max-restarts-per-min'];
            delete obj['max-restarts-per-min'];
        } else {
            obj['max_restarts_per_min'] = 3;
        }

        if ('use-sysrepo' in obj) {
            obj['use_sysrepo'] = obj['use-sysrepo'];
            delete obj['use-sysrepo'];
        } else {
            obj['use_sysrepo'] = false;
        }

        if ('interface' in obj) {
            for (let i = 0; i < obj['interface'].length; i++) {
                if (obj['interface'][i].direction == 'IN') {
                    obj['in_ifces'].push(NsgInterface.newFromApi(obj['interface'][i]));
                } else {
                    obj['out_ifces'].push(NsgInterface.newFromApi(obj['interface'][i]));
                }
            }
            delete obj['interface'];
        }
        delete obj['module-ref'];

        return new NsgInstance(obj);
    }

    static newFromDefaults() {
        return new NsgInstance({
            name: '',
            nsgModule: new NsgModule({}),
            running: false,
            enabled: true,
            use_sysrepo: false,
            max_restarts_per_min: 3,
            params: '',
            in_ifces: [],
            out_ifces: [],
        });
    }
}