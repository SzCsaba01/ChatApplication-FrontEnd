import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { UnsubscriptionError, takeUntil } from 'rxjs';
import { ChangeProfilePictureDto } from 'src/app/models/User/ChangeProfilePictureDto';
import { EditUserDto } from 'src/app/models/User/EditUserDto';
import { GetUserDto } from 'src/app/models/User/GetUserDto';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent extends SelfUnsubscriberBase implements OnInit {

  @Input() id!: Guid;
  @Input() profilePicture?: string;

  @Output() isProfileDetailsModalShownEvent = new EventEmitter(); 

  changeProfilePictureDto : ChangeProfilePictureDto;

  profileDetailsForm: FormGroup;

  firstName: FormControl;
  lastName: FormControl;
  username: FormControl;
  email: FormControl;

  getUserDetails!: GetUserDto;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { 
    super();

    this.username = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.email = new FormControl('', [Validators.required, Validators.email]);

    this.profileDetailsForm = this.formBuilder.group ({
      'username' : this.username,
      'firstName': this.firstName,
      'lastName': this.lastName,
      'email': this.email,
    });


    this.changeProfilePictureDto = new ChangeProfilePictureDto();
    this.changeProfilePictureDto.profilePicture = new FormData();
   
  }

  ngOnInit(): void {
    this.userService.getUserProfileDetailsById(this.id)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(
      (userDetails) => {
        this.firstName.setValue(userDetails.firstName);
        this.lastName.setValue(userDetails.lastName);
        this.username.setValue(userDetails.username);
        this.email.setValue(userDetails.email);

        this.profileDetailsForm.patchValue({
          'username': this.username?.value,
           'email': this.email?.value,
           'firstName': this.firstName?.value,
           'lastName': this.lastName?.value,
        })
      }
    );
    this.changeProfilePictureDto.userId = this.id;
  }

  onChangeProfilePicture(files : any){
    if(files.length !== 0){
      const reader = new FileReader();
      var fileToUpload = <File>files[0];

      reader.readAsDataURL(fileToUpload);
      this.changeProfilePictureDto.profilePicture!.append('userId', this.changeProfilePictureDto.userId as unknown as string);
      this.changeProfilePictureDto.profilePicture!.append('file', fileToUpload, fileToUpload.name);
  
      reader.onload = () => {
        this.changeProfilePictureDto.path = reader.result as string;
        this.profilePicture = this.changeProfilePictureDto.path;
      }
    }
  }

  onSaveProfilePicture(){
    if(!this.changeProfilePictureDto.path){
      return;
    }

    this.userService.changeUserProfilePicture(this.changeProfilePictureDto.profilePicture!)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onEditProfileDetails(editUserDto: EditUserDto) {
    editUserDto.userId = this.id;

    this.userService.editUserDetails(editUserDto)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  onCloseProfileDetailsModal(){
    this.isProfileDetailsModalShownEvent.emit();
  }

}
