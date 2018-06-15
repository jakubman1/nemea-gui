import { Injectable } from '@angular/core';
// import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { NsgModule } from "../models/nsg-module";
import { of } from 'rxjs/observable/of';
import {NsgInstance} from "../models/nsg-instance";

@Injectable()
export class NsgModulesService {

    constructor(private http: HttpClient) {}

    getAllModules() : Observable<NsgModule[]> {
        console.log("This is new version, getting all modules");
        return this.http.get<NsgModule[]>('/nemea/modules')
            .pipe(
                //map((m: object) => NsgModule.newFromApi(m))
                map((response: object) => {
                    let result = [];
                    for(let instance in response['data']) {
                        result.push(NsgInstance.newFromApi(instance));
                    }
                    return result;
                })
            );
    }

    getAllModulesNames(): Observable<string[]> {
        return this.http.get<string[]>('/nemea/modules')
            .pipe(
                map((response: object) => response['name'])
            );
    }

    getModule(moduleName: string): Observable<NsgModule> {
        return this.http.get<NsgModule>(`/nemea/modules/${moduleName}`)
            .pipe(
                map((response: object) => NsgModule.newFromApi(response))
            );
    }

    createModule(mod: NsgModule): Observable<object> {
        return this.http.post(`/nemea/modules`, mod.apiJson());
    }

    updateModule(moduleOrigName: string, mod: NsgModule): Observable<object> {
        return this.http.put(`/nemea/modules/${moduleOrigName}`, mod.apiJson());
    }

    removeModule(moduleName: string) : Observable<object> {
        return this.http.delete(`/nemea/modules/${moduleName}`);
    }
}
