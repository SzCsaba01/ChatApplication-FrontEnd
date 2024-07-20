import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SendMessageDto } from '../models/Message/SendMessageDto';
import * as signalR from '@microsoft/signalr';
import { GetMessagesDto } from '../models/Message/GetMessagesDto';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private _url = 'Message'

  private hubConnection!: signalR.HubConnection;

  @Output() onGetNewMessagesEvent = new EventEmitter<GetMessagesDto>();

  constructor(private http: HttpClient) { 

  }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.messageSocketUrL}`)
    .build();

    this.hubConnection
    .start()
    .catch(err => console.log('Error while starting connection: ' + err));
  }

  public getMessages(chatId: Guid): Observable<GetMessagesDto>{
    return this.http.get<GetMessagesDto>(`${environment.apiUrl}/${this._url}/GetMessages?chatId=${chatId}`);
  }

  public sendMessage(sendMessageDto: SendMessageDto){
    return this.http.post(`${environment.apiUrl}/${this._url}/SendMessage`, sendMessageDto);
  }

  public leaveGroup(groupName: Guid): void {
    if(this.hubConnection.state == signalR.HubConnectionState.Connected){
      this.hubConnection.invoke('LeaveGroupSocket', groupName)
        .catch(err => console.error('Error while leaving group:', err));
    }
  }

  public joinGroup(groupName: Guid): void {
    if(this.hubConnection.state == signalR.HubConnectionState.Connected){
      this.hubConnection.invoke('JoinGroupSocket', groupName)
      .catch(err => console.error('Error while joining group:', err));
    }
    else{
      setTimeout(() => {
        this.joinGroup(groupName);
      }, 500);
    }

  }

  public addTransferMessageListener(): Observable<GetMessagesDto> {
    return new Observable((observer) => {
      this.hubConnection.on('ReceiveMessage', (getMessagesDto: GetMessagesDto) => {
        observer.next(getMessagesDto);
      });
    });
  }
}
