import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { FriendRequestFlag } from 'src/app/enums/FriendRequestFlag';
import { AcceptOrDeleteFriendRequestDto } from 'src/app/models/FriendRequest/AcceptOrDeleteFriendRequestDto';
import { GetFriendRequestDto } from 'src/app/models/FriendRequest/GetFriendRequestDto';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.scss']
})
export class FriendRequestComponent extends SelfUnsubscriberBase implements OnInit {

  @Input() getFriendRequestDto!: GetFriendRequestDto;
  @Input() id!: Guid;

  friendRequestFlag: typeof FriendRequestFlag = FriendRequestFlag;

  @Output() acceptOrDeclineFriendRequest = new EventEmitter<GetFriendRequestDto>();

  constructor(
    private friendRequestService: FriendRequestService,
  ) {
    super();
   }

  ngOnInit(): void {
  }

  onClickAcceptFriendRequest() {
    var acceptFriendRequestDto = new AcceptOrDeleteFriendRequestDto();
    acceptFriendRequestDto.id = this.id;
    acceptFriendRequestDto.username = this.getFriendRequestDto.senderName;

    this.friendRequestService.acceptFriendRequest(acceptFriendRequestDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() =>{
        this.acceptOrDeclineFriendRequest.emit(this.getFriendRequestDto);
      });
  }

  onClickDeclineFriendRequest() {
    var declineFriendRequestDto = new AcceptOrDeleteFriendRequestDto();
    declineFriendRequestDto.id = this.id;
    declineFriendRequestDto.username = this.getFriendRequestDto.senderName;

    this.friendRequestService.declineFriendRequest(declineFriendRequestDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() =>{
        this.acceptOrDeclineFriendRequest.emit(this.getFriendRequestDto);
      });
  }

}
