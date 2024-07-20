import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LeaveChatDto } from '../models/Chat/LeaveChatDto';
import { GetChatsDto } from '../models/Chat/GetChatsDto';
import { EditGroupChatDto } from '../models/Chat/EditGroupChatDto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _url = 'Chat'

  constructor(private http: HttpClient) { }

  public getChatsByUserId(userId: Guid): Observable<GetChatsDto>{
    return this.http.get<GetChatsDto>(`${environment.apiUrl}/${this._url}/GetChatsByUserId?Id=${userId}`);
  }

  public leaveChat(leaveChat: LeaveChatDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/LeaveChat`, leaveChat);
  }

  public creatGroupChat(createGroupChatDto: FormData){
    return this.http.post(`${environment.apiUrl}/${this._url}/CreateGroupChat`, createGroupChatDto);
  }
  
  public changeChatProfilePicture(changeGroupChatProfilePictureDto: FormData){
    return this.http.put(`${environment.apiUrl}/${this._url}/ChangeGroupChatProfilePicture`, changeGroupChatProfilePictureDto);
  }

  public editGroupChat(editGroupChatDto: EditGroupChatDto){
    return this.http.put(`${environment.apiUrl}/${this._url}/EditGroupChat`, editGroupChatDto);
  }
}
