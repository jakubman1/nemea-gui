import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReporterService {

    constructor(private http: HttpClient) { }

    get() {
        return this.http.get<object>('/nemea/reporters/config')
            .pipe(
                catchError(this.handleError)
            );
    }

    update(data: Object) {
        return this.http.put('/nemea/reporters/config', data)
            .pipe(
                catchError(this.handleError)
            );
    }


    save(idx: number, conf: string) {
        if (idx < 0) {
            throw new Error('Index not set');
        }

        if (conf === '') {
            throw new Error('Configuration is empty')
        }

        console.log(idx);
        console.log(conf);
    }

    private handleError(err: Response | any) {
        return Observable.throw(err);
    }

}
