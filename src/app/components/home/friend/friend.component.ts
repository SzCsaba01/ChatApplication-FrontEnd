import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { DeleteFriendDto } from 'src/app/models/User/DeleteFriendDto';
import { GetUserDto } from 'src/app/models/User/GetUserDto';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent extends SelfUnsubscriberBase implements OnInit {

  @Input() getUserDto!: GetUserDto;
  @Input() isFriendAddedToGroupChat : boolean = false;
  @Input() isFriendGroupMember : boolean = false;

  @Input() isUserAdmin: boolean = false;
  
  @Output() addFriendToGroupChat = new EventEmitter<GetUserDto>();
  @Output() deleteFriendFromGroupChat = new EventEmitter<GetUserDto>();
  @Output() changeMemberToAdmin = new EventEmitter<GetUserDto>();

  constructor() {
    super()
   }

  ngOnInit(): void {
  }

  onAddFriendToGroupChat(){
    this.addFriendToGroupChat.emit(this.getUserDto);
    this.isFriendAddedToGroupChat = true;
  }

  onDeleteFriendFromGroupChat(){
    this.deleteFriendFromGroupChat.emit(this.getUserDto);
    this.isFriendAddedToGroupChat = false;
  }

  onAddChangeMemberToAdmin(){
    this.changeMemberToAdmin.emit(this.getUserDto);
    this.isFriendGroupMember = true;
  }

}
