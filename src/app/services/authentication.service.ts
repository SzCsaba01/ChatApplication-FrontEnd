import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationRequestDto } from '../models/Authentication/AuthenticationRequestDto';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private _url = 'Authentication'

  constructor(
    private http: HttpClient,
    private route: Router) { }

  public login(userAuthentication: AuthenticationRequestDto){
    return this.http
      .post<any>(`${environment.apiUrl}/${this._url}/Login`, userAuthentication)
      .pipe(
        map((response: {id: string, token: string, role: string}) => {
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('id', response.id);
          localStorage.setItem('role', response.role);
          return response;
        })
      );
  }

  logout(){
    var userId = localStorage.getItem('id')

    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    this.route.navigate(['/login']);
  }

  public logoutRequest(userId: Guid){
    return this.http.post(`${environment.apiUrl}/${this._url}/Logout?id=${userId}`, userId);
  }

  getAcessToken(){
    return localStorage.getItem('access_token')
  }

  isAuthenticated(){
    let token = this.getAcessToken()
    return (token != null && token != undefined && token != '')
  }

  getUserRole(){
    return localStorage.getItem('role')
  }

}