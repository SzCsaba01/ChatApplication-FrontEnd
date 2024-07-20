import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-get-user-activities-button-cell',
  templateUrl: './get-user-activities-button-cell.component.html',
  styleUrls: ['./get-user-activities-button-cell.component.scss']
})
export class GetUserActivitiesButtonCellComponent implements ICellRendererAngularComp {

  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  btnClickedHandler(event: any){
    this.params.clicked(this.params.node.data['username']);
  }
}
