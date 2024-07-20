import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { RoleType } from 'src/app/enums/RoleType';
import { GetChatDto } from 'src/app/models/Chat/GetChatDto';
import { GetChatsDto } from 'src/app/models/Chat/GetChatsDto';
import { GetFriendRequestDto } from 'src/app/models/FriendRequest/GetFriendRequestDto';
import { GetFriendRequestsDto } from 'src/app/models/FriendRequest/GetFriendRequestsDto';
import { GetMessagesDto } from 'src/app/models/Message/GetMessagesDto';
import { SendMessageDto } from 'src/app/models/Message/SendMessageDto';
import { GetFriendListDto } from 'src/app/models/User/GetFriendListDto';
import { GetSearchedUserDto } from 'src/app/models/User/GetSearchedUserDto';
import { GetUserDto } from 'src/app/models/User/GetUserDto';
import { UserSearchDto } from 'src/app/models/User/UserSearchDto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';
import { FriendRequestService } from 'src/app/services/friend-request.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends SelfUnsubscriberBase implements OnInit {

  loginStatus : boolean = false;

  roleType = RoleType;

  isShownEditProfileModal: boolean = false;

  isShownLogoutModal: boolean  = false;

  userId : Guid = localStorage.getItem('id') as unknown as Guid;

  userRole : string = localStorage.getItem('role') as unknown as string;
  expectedRole : string = RoleType.Admin as unknown as string;

  profilePicture?: string;

  getSearchedUserDto: GetSearchedUserDto;

  searchedUsername: string = '';

  currentPageSearchedUsers: number = 1;
  totalNumberOfPagesSearchedUsers!: number;
  totalNumberOfSearchedUsers!: number;
  currentNumberOfSearchedUsersStartRow: number = 1;
  currentNumberOfSearchedUsersEndRow!: number;

  rowData: GetSearchedUserDto[];

  getFriendRequestsDto: GetFriendRequestsDto;

  getFriendListPaginatedDto: GetFriendListDto;

  friendList : GetUserDto[];

  getChatsDto: GetChatsDto;

  isCreateGroupChatModalShown: boolean = false;

  selectedChat?: GetChatDto;

  isEditGroupChatModalShown: boolean = false;

  isEditButtonShown: boolean = false;

  getMessagesDto: GetMessagesDto;

  sendMessageFormGroup: FormGroup;

  message: FormControl;
  senderId: FormControl;
  chatId: FormControl;

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private friendRequestService: FriendRequestService,
    private userService: UserService,
    private authenticationService : AuthenticationService,
    private route: Router,
    private formBuilder: FormBuilder
  ) {
    super();

    this.getSearchedUserDto = new GetSearchedUserDto();
    this.rowData = new Array<GetSearchedUserDto>();
    this.getFriendRequestsDto = new GetFriendRequestsDto();
    this.getFriendListPaginatedDto = new GetFriendListDto();
    this.friendList = new Array<GetSearchedUserDto>();
    this.getChatsDto = new GetChatsDto();
    this.getMessagesDto = new GetMessagesDto();

    this.message = new FormControl('');
    this.senderId = new FormControl(this.userId);
    this.chatId = new FormControl('');

    this.sendMessageFormGroup = this.formBuilder.group({
      'text': this.message,
      'senderId': this.senderId,
      'chatId': this.chatId,
    });

  }

  ngOnInit(): void {
    if(!this.authenticationService.isAuthenticated()){
      this.route.navigate(['login']);
    }

    this.messageService.startConnection();

    this.userService.getUserProfilePictureUrl(this.userId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((result) => {
      this.profilePicture = result;
    });

    this.friendRequestService.getReceivedFriendRequestsById(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.getFriendRequestsDto = result;
      });

    this.userService.getFriendList(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.friendList = result.friends;
      });

      this.chatService.getChatsByUserId(this.userId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.getChatsDto = result;
          this.selectedChat = this.getChatsDto.chats[0];
          this.messageService.joinGroup(this.selectedChat.chatId);

          this.messageService.addTransferMessageListener()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((message: GetMessagesDto) => {
            if (message.messages[0].chatId === this.selectedChat!.chatId) {
              this.getMessagesDto = message;
            }
          });

          this.messageService.getMessages(this.selectedChat.chatId)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(result => {
              this.getMessagesDto = result;
            });
      });

  }

  changeShowLogoutModal(){
    this.isShownLogoutModal = !this.isShownLogoutModal;
  }

  onLogout(){
    this.authenticationService.logoutRequest(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
    this.authenticationService.logout();
    this.loginStatus != this.loginStatus; 
    this.isShownLogoutModal = !this.isShownLogoutModal
    this.route.navigate(['login']);
  }

  onChangeShowProfileDetailsModal(){
    this.isShownEditProfileModal = !this.isShownEditProfileModal;
  }

  onChangeShowLogOutModal(){
    this.isShownLogoutModal = !this.isShownLogoutModal;
  }

  onChangeShowCreateGroupChatModal(){
    this.isCreateGroupChatModalShown = !this.isCreateGroupChatModalShown;
  }

  nextPage(){
    this.currentPageSearchedUsers++;

    if(this.searchedUsername){
     this.getSearchedUsersByUserName(1)
    }

  }

  lastPage(){
    this.currentPageSearchedUsers = this.totalNumberOfPagesSearchedUsers;

    if(this.searchedUsername){
      this.getSearchedUsersByUserName(2);
    }
  }

  previousPage(){
    this.currentPageSearchedUsers--;
  
    if(this.searchedUsername){
      this.getSearchedUsersByUserName(-1);
    }
  }

  firstPage(){
    this.currentPageSearchedUsers = 1;
    
    if(this.searchedUsername){
      this.getSearchedUsersByUserName(-2);
    }
  }

  onSearchUserByName(){
    this.currentPageSearchedUsers = 1;

    if(!this.searchedUsername){
      this.rowData = [];
    }

    if(this.searchedUsername){
      this.getSearchedUsersByUserName(-2);
    }
  }

  getSearchedUsersByUserName(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.searcherId = this.userId;
    searchedUsers.page = this.currentPageSearchedUsers;
    searchedUsers.search = this.searchedUsername;

    this.userService.getSearchedUsersByUsername(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getSearchedUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPagesSearchedUsers = result.numberOfPages;
        this.totalNumberOfSearchedUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfSearchedUsersStartRow = 1;
            this.currentNumberOfSearchedUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfSearchedUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfSearchedUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfSearchedUsersStartRow += numberOfOldUsers;
            this.currentNumberOfSearchedUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfSearchedUsersStartRow = this.totalNumberOfSearchedUsers - numberOfNewUsers + 1;
            this.currentNumberOfSearchedUsersEndRow = this.totalNumberOfSearchedUsers;
            break;
          default:
            this.currentNumberOfSearchedUsersStartRow = 0;
            this.currentNumberOfSearchedUsersEndRow = numberOfOldUsers;
      }
      this.rowData = result.getSearchedUserDto;
    })
  }

  onDeclineOrAcceptFriendRequest(getFriendRequest: GetFriendRequestDto){
    this.getFriendRequestsDto.friendRequests.splice(this.getFriendRequestsDto.friendRequests.indexOf(getFriendRequest), 1);
  }

  onSelectChat(getChatDto: GetChatDto){
    this.selectedChat = getChatDto;

    this.messageService.getMessages(this.selectedChat!.chatId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.getMessagesDto = result;
    });

    if(this.selectedChat.chatAdmins.length == 2 && this.selectedChat.users.length == 0){
      this.isEditButtonShown = false;
      return;
    }
    this.isEditButtonShown = true;

  }

  onGetMessagesFromSelectedChat(getMessagesDto: GetMessagesDto){
    this.getMessagesDto = getMessagesDto;
  }

  onChangeShowEditGroupChatModal(){
    this.isEditGroupChatModalShown = !this.isEditGroupChatModalShown;
  }

  onEditGroupChat(groupChat: GetChatDto){
    var index = this.getChatsDto.chats.indexOf(this.selectedChat!);
    this.getChatsDto.chats[index] = groupChat;
  }

  onSendMessage(sendMessageDto: SendMessageDto){

    if(sendMessageDto.text == ''){
      return;
    }

    sendMessageDto.chatId = this.selectedChat!.chatId;

    this.messageService.sendMessage(sendMessageDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();

    this.sendMessageFormGroup.patchValue({
      'text': '',
    });
  }

}
