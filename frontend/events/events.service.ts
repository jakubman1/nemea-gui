import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EventsService {
    constructor(private http: HttpClient) {}

    last_events(items: number) {
        return this.http.get('/nemea/events/' + String(items))
            .pipe(
                catchError(this.handleError)
            );
    }

    query(query: Object) {
        let params = new HttpParams();
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                params = params.append(key.toString(), query[key]);
            }
        }
        return this.http.get('/nemea/events/query', {params: params})
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(err: Response | any) {
        return Observable.throw(err);
    }
}
