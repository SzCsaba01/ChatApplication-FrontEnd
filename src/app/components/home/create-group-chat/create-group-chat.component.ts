import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { GetChatDto } from 'src/app/models/Chat/GetChatDto';
import { GetUserDto } from 'src/app/models/User/GetUserDto';
import { GetFriendListDto } from 'src/app/models/User/GetFriendListDto';
import { ChatService } from 'src/app/services/chat.service';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { takeUntil } from 'rxjs';
import { CreateGroupChatDto } from 'src/app/models/Chat/CreateGroupChatDto';

@Component({
  selector: 'app-create-group-chat',
  templateUrl: './create-group-chat.component.html',
  styleUrls: ['./create-group-chat.component.scss']
})
export class CreateGroupChatComponent extends SelfUnsubscriberBase implements OnInit {
  @Input() userId!: Guid;

  @Output() isCreateGroupChatModalShownEvent = new EventEmitter();
  @Output() newChatEvent = new EventEmitter<GetChatDto>();
  
  createGroupChatForm: FormGroup;

  chatName: FormControl;
  
  friendList: GetFriendListDto;

  friendsToBeAddedByUsername: string[] = [];

  usersToBeAdded: GetUserDto[] = [];

  createGroupChatDto: CreateGroupChatDto;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private formBuilder: FormBuilder,
  ) {
    super();

    this.chatName = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.createGroupChatForm = this.formBuilder.group ({
      'chatName' : this.chatName,
    })

    this.friendList = new GetFriendListDto();
    this.createGroupChatDto = new CreateGroupChatDto();
    this.createGroupChatDto.creatGroupChatDto = new FormData();
   }

  ngOnInit(): void {
    this.userService.getFriendList(this.userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.friendList = result;
      })
  }

  isFormValid(){
    if(this.friendsToBeAddedByUsername.length < 2 || this.createGroupChatDto.path === undefined || this.createGroupChatDto.path == ''){
      return true;
    }

    return false;
  }

  onChangeProfilePicture(files : any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      reader.readAsDataURL(fileToUpload);
      this.createGroupChatDto.creatGroupChatDto!.append('file', fileToUpload, fileToUpload.name);
  
      reader.onload = () => {
        this.createGroupChatDto.path = reader.result as string;
      }
    }
  }

  onAddFriendToGroupChat(getUserDto: GetUserDto){
    this.friendsToBeAddedByUsername.push(getUserDto.username);

    this.usersToBeAdded.push(getUserDto);

    this.friendList.friends.splice(this.friendList.friends.indexOf(getUserDto), 1);
  }

  onDeleteFriendFromGroupChat(getUserDto: GetUserDto){
    this.friendsToBeAddedByUsername.splice(this.friendsToBeAddedByUsername.indexOf(getUserDto.username), 1);

    this.friendList.friends.push(getUserDto);

    this.usersToBeAdded.splice(this.usersToBeAdded.indexOf(getUserDto), 1);
  }

  onCreateGroupChat(chatName: any){
    this.createGroupChatDto.creatGroupChatDto.append('chatName', chatName.chatName as string);
    this.createGroupChatDto.creatGroupChatDto.append('userId', this.userId as unknown as string);
    this.friendsToBeAddedByUsername.forEach(username => {
      this.createGroupChatDto.creatGroupChatDto.append('usernames[]', username);
    });

    this.chatService.creatGroupChat(this.createGroupChatDto.creatGroupChatDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.isCreateGroupChatModalShownEvent.emit();
      });
  }

  onCloseCreateGroupChatModal(){
    this.isCreateGroupChatModalShownEvent.emit();
  }

}
