export class NsgModule {
    name: string;
    trap_monitorable: boolean;
    trap_ifces_cli: boolean;
    is_sysrepo_ready: boolean;
    sr_model_prefix?: string;
    path: string;
    description: string;
    in_ifces_cnt: string;
    out_ifces_cnt: string;

    constructor(fields: any) {
        Object.assign(this, fields);
    }

    static newFromDefaults() {
        return new NsgModule({
            name: '',
            trap_monitorable: false,
            trap_ifces_cli: false,
            is_sysrepo_ready: false,
            in_ifces_cnt: '0',
            out_ifces_cnt: '0',
            nsgInstances: []
        });
    }

    apiJson(): object {
        return {
            name: this.name,
            path: this.path,
            description: this.description,
            'in-ifces-cnt': this.in_ifces_cnt,
            'out-ifces-cnt': this.out_ifces_cnt,
            'sr-model-prefix': this.sr_model_prefix,
            'is-sysrepo-ready': this.is_sysrepo_ready,
            'trap-ifces-cli': this.trap_ifces_cli,
            'trap-monitorable': this.trap_monitorable
        };
    }

    static newFromApi(obj): NsgModule {
        console.log('newFromApi object:');
        console.log(obj);
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        if ('sr-model-prefix' in obj) {
            obj['sr_model_prefix'] = obj['sr-model-prefix'];
            delete obj['sr-model-prefix'];
        } else {
            obj['sr_model_prefix'] = '';
        }

        obj['is_sysrepo_ready'] = obj['is-sysrepo-ready'];
        delete obj['is-sysrepo-ready'];
        obj['trap_ifces_cli'] = obj['trap-ifces-cli'];
        delete obj['trap-ifces-cli'];
        obj['trap_monitorable'] = obj['trap-monitorable'];
        delete obj['trap-monitorable'];

        if ('in-ifces-cnt' in obj) {
            obj['in_ifces_cnt'] = obj['in-ifces-cnt'];
            delete obj['in-ifces-cnt'];
        } else {
            obj['in_ifces_cnt'] = 0;
        }

        if ('out-ifces-cnt' in obj) {
            obj['out_ifces_cnt'] = obj['out-ifces-cnt'];
            delete obj['out-ifces-cnt'];
        } else {
            obj['out_ifces_cnt'] = 0;
        }

        return new NsgModule(obj);
    }
}