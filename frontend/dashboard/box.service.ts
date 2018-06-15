import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BoxService {

    constructor(private http: HttpClient) {}

    piechart(box): Observable<any[]> {
        /**
          * Set time window
          * The difference in capitalization is because of backward compatibility
          */
        let params = new HttpParams()
            .set('begintime', box['beginTime'])
            .set('endtime', box['endTime'])
            .set('metric', box['metric'])
            .set('type', 'piechart');


        return this.http.get<any[]>('/nemea/events/aggregate', { params: params })
            .pipe(
                catchError(BoxService.handleError)
            );
    }

    barchart(box): Observable<any[]> {

        /**
          * Set time window
          * The difference in capitalization is because of backward compatibility
          */
        let params = new HttpParams()
            .set('begintime', box['beginTime'])
            .set('endtime', box['endTime'])
            .set('window', box['window'] ? box['window'] : 60)
            .set('type', 'barchart');


        return this.http.get<any[]>('/nemea/events/aggregate', { params: params })
            .pipe(
                catchError(BoxService.handleError)
            );
    }

    count(box) {
        let params = new HttpParams()
            .set('begintime', box['beginTime'])
            .set('endtime', box['endTime'])
            .set('category', 'any');


        return this.http.get<any[]>('/nemea/events/count', {params: params})
            .pipe(
                catchError(BoxService.handleError)
            );
    }

    top(box) {
        let params = new HttpParams()
            .set('begintime', box['beginTime'])
            .set('endtime', box['endTime']);

        return this.http.get<any[]>('/nemea/events/top', { params: params })
            .pipe(
                catchError(BoxService.handleError)
            );
    }


    static handleError(err: Response | any) {
        return Promise.reject(err);
    }
}
