import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ConfirmRegistrationComponent } from './components/confirm-registration/confirm-registration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationInterceptor } from './helpers/auth-interceptor';
import { ErrorInterceptor } from './helpers/error-interceptor';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { ProfileDetailsComponent } from './components/home/profile-details/profile-details.component';
import { LogOutComponent } from './components/home/log-out/log-out.component';
import { FriendRequestComponent } from './components/home/friend-request/friend-request.component';
import { SearchedUsersComponent } from './components/home/searched-users/searched-users.component';
import { FriendComponent } from './components/home/friend/friend.component';
import { ChatComponent } from './components/home/chat/chat.component';
import { CreateGroupChatComponent } from './components/home/create-group-chat/create-group-chat.component';
import { EditGroupChatModalComponent } from './components/home/edit-group-chat-modal/edit-group-chat-modal.component';
import { ManageUsersComponent } from './components/home/manage-users/manage-users.component';
import { DeleteButtonCellComponent } from './components/home/manage-users/delete-button-cell/delete-button-cell.component';
import { AgGridModule } from 'ag-grid-angular';
import { GetUserActivitiesButtonCellComponent } from './components/home/manage-users/get-user-activities-button-cell/get-user-activities-button-cell.component';
import { GenerateXMLFileForUSerButtonCellComponent } from './components/home/manage-users/generate-xmlfile-for-user-button-cell/generate-xmlfile-for-user-button-cell.component';
import { MessageComponent } from './components/home/message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    ConfirmRegistrationComponent,
    PageNotFoundComponent,
    ChangePasswordComponent,
    LoginComponent,
    HomeComponent,
    ProfileDetailsComponent,
    LogOutComponent,
    FriendRequestComponent,
    SearchedUsersComponent,
    FriendComponent,
    ChatComponent,
    CreateGroupChatComponent,
    EditGroupChatModalComponent,
    ManageUsersComponent,
    DeleteButtonCellComponent,
    GetUserActivitiesButtonCellComponent,
    GenerateXMLFileForUSerButtonCellComponent,
    MessageComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthenticationInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
