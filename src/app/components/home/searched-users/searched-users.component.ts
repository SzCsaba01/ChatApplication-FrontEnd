import { Component, Input, OnInit } from '@angular/core';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { FriendRequestFlag } from 'src/app/enums/FriendRequestFlag';
import { SendFriendRequestDto } from 'src/app/models/FriendRequest/SendFriendRequestDto';
import { GetSearchedUserDto } from 'src/app/models/User/GetSearchedUserDto';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-searched-users',
  templateUrl: './searched-users.component.html',
  styleUrls: ['./searched-users.component.scss']
})
export class SearchedUsersComponent extends SelfUnsubscriberBase  implements OnInit {
  @Input() getSearchedUserDto!: GetSearchedUserDto;
  @Input() id!: Guid;

  friendRequestFlag: typeof FriendRequestFlag = FriendRequestFlag;

  constructor(
    private friendRequestService: FriendRequestService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  sendFriendRequest(){
    var sendFriendRequestDto = new SendFriendRequestDto();
    sendFriendRequestDto.receiverName = this.getSearchedUserDto.username;
    sendFriendRequestDto.senderId = this.id;
    sendFriendRequestDto.createdAt = new Date();

    this.friendRequestService.sendFriendRequest(sendFriendRequestDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getSearchedUserDto.friendRequestFlag = FriendRequestFlag.Sent;
      });
  }
}