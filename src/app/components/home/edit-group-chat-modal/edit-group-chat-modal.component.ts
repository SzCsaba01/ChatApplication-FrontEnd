import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { takeUntil } from 'rxjs';
import { EditGroupChatDto } from 'src/app/models/Chat/EditGroupChatDto';
import { GetChatDto } from 'src/app/models/Chat/GetChatDto';
import { GetFriendListDto } from 'src/app/models/User/GetFriendListDto';
import { GetUserDto } from 'src/app/models/User/GetUserDto';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-edit-group-chat-modal',
  templateUrl: './edit-group-chat-modal.component.html',
  styleUrls: ['./edit-group-chat-modal.component.scss']
})
export class EditGroupChatModalComponent extends SelfUnsubscriberBase implements OnInit {

  @Input() getChatDto?: GetChatDto;
  @Input() userId!: Guid;

  @Output() onEditGroupChatEvent = new EventEmitter<GetChatDto>();
  @Output() onCloseEditGroupChatModalEvent = new EventEmitter();

  editGroupChatDetails: FormGroup;

  chatName: FormControl;

  changeProfilePictureFormData: FormData;

  friendList: GetFriendListDto;

  friendsToBeAddedByUsername: string[] = [];

  usersToBeAdded: GetUserDto[] = [];

  adminsToBeAddedByUsername: string[] = [];

  usersToBeRemoved: GetUserDto[] = [];

  usersToBeRemovedByUsername: string[] = [];

  user : GetUserDto;

  isUserAdmin!: boolean ;

  constructor(
    private chatService: ChatService,
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) { 
    super();
    
    this.chatName = new FormControl('', [Validators.required, Validators.minLength(5)]);

    this.editGroupChatDetails = this.formBuilder.group ({
      'chatName' : this.chatName,
    });

    this.changeProfilePictureFormData = new FormData();
    this.friendList = new GetFriendListDto();
    this.user = new GetUserDto();
    
  }

  ngOnInit(): void {
    this.chatName.setValue(this.getChatDto?.chatName);
    this.userService.getFriendList(this.userId)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.friendList = result;
      this.friendList.friends = this.friendList.friends.filter(x => !this.getChatDto?.users.some(y => y.username === x.username));
      this.friendList.friends = this.friendList.friends.filter(x => !this.getChatDto?.chatAdmins.some(y => y.username === x.username));
    })

    this.userService.getUserProfileDetailsById(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.user = result;
        this.isUserAdmin = this.isUserAdminCheck();
      })
  }

  isUserAdminCheck(){
    if(this.getChatDto?.chatAdmins.some(x => x.username === this.user.username)){
      return true;
    }
    return false;
  }

  onCloseEditGroupChatModal() {
    this.onCloseEditGroupChatModalEvent.emit();
  }

  isFormValid(){
    if(this.friendsToBeAddedByUsername.length < 1 && this.usersToBeRemovedByUsername.length < 1){
      return true;
    } 

    return false;
  }

  onChangeProfilePicture(files : any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      reader.readAsDataURL(fileToUpload);
      this.changeProfilePictureFormData.append('file', fileToUpload, fileToUpload.name);

      reader.onload = () => {
        this.getChatDto!.chatPicture = reader.result as string;
      }
    }
  }

  onSaveProfilePicture(){
    this.changeProfilePictureFormData.append('chatId', this.getChatDto!.chatId as unknown as string);
    this.chatService.changeChatProfilePicture(this.changeProfilePictureFormData)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.changeProfilePictureFormData = new FormData();
    })
  }

  onAddFriendToListToBeAdded(getUserDto: GetUserDto){
    this.friendsToBeAddedByUsername.push(getUserDto.username);

    this.usersToBeAdded.push(getUserDto);

    this.friendList.friends.splice(this.friendList.friends.indexOf(getUserDto), 1);
  }

  onDeleteFriendFromListToBeAdded(getUserDto: GetUserDto){
    this.friendsToBeAddedByUsername.splice(this.friendsToBeAddedByUsername.indexOf(getUserDto.username), 1);

    this.friendList.friends.push(getUserDto);

    this.usersToBeAdded.splice(this.usersToBeAdded.indexOf(getUserDto), 1);
  }

  onDeleteFriendFromGroupChat(getUserDto: GetUserDto){
    
  }

  onEditGroupChat(name: any){
    var editGroupChatDto = new EditGroupChatDto();
    editGroupChatDto.chatId = this.getChatDto!.chatId;
    editGroupChatDto.chatName = name.chatName as string;
    editGroupChatDto.usersToBeAdded = this.friendsToBeAddedByUsername;
    editGroupChatDto.userId = this.userId;
    editGroupChatDto.adminsToBeAdded = this.adminsToBeAddedByUsername;
    editGroupChatDto.membersToBeRemoved = this.usersToBeRemovedByUsername;

    this.chatService.editGroupChat(editGroupChatDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.getChatDto!.chatName = editGroupChatDto.chatName;
        this.getChatDto!.users = this.getChatDto!.users.concat(this.usersToBeAdded);
        this.getChatDto!.chatAdmins = this.getChatDto!.chatAdmins.concat(this.usersToBeAdded);
        this.getChatDto!.users = this.getChatDto!.users.filter(x => !this.usersToBeRemoved.some(y => y.username === x.username));
        this.onEditGroupChatEvent.emit(this.getChatDto!);
      });
  }

  onChangeMemberToAdmin(getUserDto: GetUserDto){
    this.getChatDto?.users.splice(this.getChatDto?.users.indexOf(getUserDto), 1);
    this.getChatDto?.chatAdmins.push(getUserDto);
    this.adminsToBeAddedByUsername.push(getUserDto.username);
  }

  onDeleteFriendFromListToBeRemoved(getUserDto: GetUserDto){
    this.usersToBeRemovedByUsername.splice(this.usersToBeRemovedByUsername.indexOf(getUserDto.username), 1);
    this.usersToBeRemoved.splice(this.usersToBeRemoved.indexOf(getUserDto), 1);

    this.getChatDto?.users.push(getUserDto);
  }

  onDeleteUserFromGroupChat(getUserDto: GetUserDto){
    this.usersToBeRemovedByUsername.push(getUserDto.username);
    this.usersToBeRemoved.push(getUserDto);

    this.getChatDto?.users.splice(this.getChatDto?.users.indexOf(getUserDto), 1);
  }
}
