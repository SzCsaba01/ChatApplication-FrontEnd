import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Guid } from 'guid-typescript';
import { findIndex, takeUntil } from 'rxjs';
import { GetChatDto } from 'src/app/models/Chat/GetChatDto';
import { LeaveChatDto } from 'src/app/models/Chat/LeaveChatDto';
import { GetMessagesDto } from 'src/app/models/Message/GetMessagesDto';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends SelfUnsubscriberBase implements OnInit, OnDestroy {

  @Input() userId!: Guid;
  @Input() getChatDto!: GetChatDto;

  @Output() onLeaveChatEvent = new EventEmitter<GetChatDto>();
  @Output() onSelectChatEvent = new EventEmitter<GetChatDto>();
  @Output() onGetMessagesEvent = new EventEmitter<GetMessagesDto>();

  isLeaveChatModalShown = false;

  getMessagesDto: GetMessagesDto;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService
  ) {
    super()
    this.getMessagesDto = new GetMessagesDto();
   }

  ngOnInit(): void {
    if(this.getChatDto.chatAdmins.length == 2 && this.getChatDto.users.length == 0){
      this.getChatDto.chatName= this.getChatDto.chatAdmins[1].username;
    }

    this.messageService.joinGroup(this.getChatDto.chatId);
  }

  OnDestroy() {
    this.messageService.leaveGroup(this.getChatDto.chatId);
  }

  onChangeShowLeaveChatModal(){
    this.isLeaveChatModalShown = !this.isLeaveChatModalShown;
  }

  onLeaveChat(){
    var leaveChatDto = new LeaveChatDto();

    leaveChatDto.chatId = this.getChatDto.chatId;
    leaveChatDto.userId = this.userId;

    this.chatService.leaveChat(leaveChatDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.onChangeShowLeaveChatModal();
        this.onLeaveChatEvent.emit(this.getChatDto);
      })
  }

  onSelectChat(){
    this.onSelectChatEvent.emit(this.getChatDto);
    this.onGetMessagesEvent.emit(this.getMessagesDto);
  }

}