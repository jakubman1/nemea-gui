import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {NsgInstance} from "../models/nsg-instance";
import {NsgInstanceStats} from "../models/nsg-instance-stats";
import {NsgInterface} from "../models/nsg-interface";

@Injectable()
export class NsgInstancesService {
    constructor(private http: HttpClient) {
    }

    getAllInstances(): Observable<NsgInstance[]> {
        return this.http.get<NsgInstance[]>('/nemea/instances')
            .pipe(
                map((response: object) => NsgInstance.newFromApi(response))
            );
    }

    getAllInstancesNames(): Observable<string[]> {
        return this.http.get<string[]>('/nemea/instances')
            .pipe(
                map((response: object) => response['name'])
            );
    }

    getAllInstancesByModuleName(moduleName: string): Observable<NsgInstance[]> {
        return this.http.get<NsgInstance[]>(`/nemea/modules/${moduleName}/instances`)
            .pipe(
                map((response: object) => NsgInstance.newFromApi(response))
            );
    }

    createInstance(inst: NsgInstance): Observable<object> {
        return this.http.post(`/nemea/instances`, inst.apiJson());
    }

    getInstance(instName: string): Observable<NsgInstance> {
        return this.http.get<NsgInstance>(`/nemea/instances/${instName}`)
            .pipe(
                map(response => NsgInstance.newFromApi(response))
            );
    }

    updateInstance(instOrigName: string, inst: NsgInstance): Observable<object> {
        return this.http.put(`/nemea/instances/${instOrigName}`, inst.apiJson());
    }

    removeInstance(instanceName: string): Observable<object> {
        return this.http.delete(`/nemea/instances/${instanceName}`);
    }


    startInstance(instanceName: string): Observable<object> {
        return this.http.post(`/nemea/instances/${instanceName}/start`,{});
    }

    stopInstance(instanceName: string): Observable<object> {
        return this.http.post(`/nemea/instances/${instanceName}/stop`, {});
    }

    restartInstance(instanceName: string): Observable<object> {
        return this.http.post(`/nemea/instances/${instanceName}/stop`, {})
            .pipe(
                map(resp => {
                    return this.http.post(`/nemea/instances/${instanceName}/start`, {})
                })
            );
    }

    getInterface(instName: string, ifcName: string): Observable<NsgInterface> {
        return this.http.get<NsgInterface>(`/nemea/instances/${instName}`)
            .pipe(
                map((response: object) => {
                    let ifces = response['interface'];
                    for (let i = 0; i < ifces.length; i++) {
                        if (ifces[i]['name'] == ifcName) {
                            return new NsgInterface(ifces[i]);
                        }
                    }
                    return null;
                })
            );
    }

    getInstanceStats(instanceName: string): Observable<NsgInstanceStats> {
        return this.http.get<NsgInstanceStats>(`/nemea/instances/${instanceName}/stats`)
            .pipe(
                map((response: object) => {
                    return NsgInstanceStats.newFromApi(response['stats']);
                })
            );
    }

    private handleError(err: Response | any) {
        return Promise.reject(err);
    }

    private errorLogger(error: any) {
        console.log('Service error:');
        console.log(error);
    }
}
