import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NemeaStatusService {
    constructor(private http: HttpClient) {}

    stats() {
        return this.http.get<object>('/nemea/status/stats')
            .pipe(
                catchError(this.handleError)
            );
    }

    topology() {
        return this.http.get<object>('/nemea/status') //FIXME this needs to be iterable, not an object!
            .pipe(
                tap((r: object) => {
                    console.log('Getting topology');
                    console.log(r);
                }),
                catchError(this.handleError)
            );
    }

    private handleError(err: Response | any) {
        return Observable.throw(err);
    }
}
