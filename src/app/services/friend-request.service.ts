import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SendFriendRequestDto } from '../models/FriendRequest/SendFriendRequestDto';
import { GetFriendRequestsDto } from '../models/FriendRequest/GetFriendRequestsDto';
import { AcceptOrDeleteFriendRequestDto } from '../models/FriendRequest/AcceptOrDeleteFriendRequestDto';


@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  private _url = 'FriendRequest'

  constructor(private http: HttpClient) { }

  public getReceivedFriendRequestsById(id: Guid): Observable<GetFriendRequestsDto>{ 
    return this.http.get<GetFriendRequestsDto>(`${environment.apiUrl}/${this._url}/GetReceivedFriendRequestsById?id=${id}`);
  }

  public sendFriendRequest(sendFriendRequestDto: SendFriendRequestDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/SendFriendRequest`, sendFriendRequestDto);
  }

  public declineFriendRequest(declineFriendRequest: AcceptOrDeleteFriendRequestDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/DeclineFriendRequest`, declineFriendRequest);
  }

  public acceptFriendRequest(acceptFriendRequest: AcceptOrDeleteFriendRequestDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/AcceptFriendRequest`, acceptFriendRequest);
  }
}
