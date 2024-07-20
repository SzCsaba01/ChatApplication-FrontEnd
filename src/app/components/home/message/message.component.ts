import { Component, Input, OnInit } from '@angular/core';
import { GetMessageDto } from 'src/app/models/Message/GetMessageDto';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() message!: GetMessageDto;

  constructor() { }

  ngOnInit(): void {
  }

}
