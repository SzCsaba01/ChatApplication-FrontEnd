import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetUserActivitiesDto } from '../models/UserAcitivity/GetUserActivitiesDto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {

  private _url = 'UserActivity'

  constructor(private http: HttpClient) { }

  public getUserActivitiesByUsername(username: string): Observable<GetUserActivitiesDto>{
    return this.http.get<GetUserActivitiesDto>(`${environment.apiUrl}/${this._url}/GetUserActivitiesByUsername?username=${username}`);
  }
}
