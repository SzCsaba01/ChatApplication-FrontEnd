import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.scss']
})
export class LogOutComponent extends SelfUnsubscriberBase implements OnInit {

  @Output() isLogOutModalShownEvent = new EventEmitter()
  @Output() isLogOutEvent = new EventEmitter()

  constructor(private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit(): void {
  }

  onCloseLogOutModal(){
    this.isLogOutModalShownEvent.emit();
  }

  onLogOut(){
    this.isLogOutEvent.emit();
    this.isLogOutModalShownEvent.emit();
  }

}
