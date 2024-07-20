import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-generate-xmlfile-for-user-button-cell',
  templateUrl: './generate-xmlfile-for-user-button-cell.component.html',
  styleUrls: ['./generate-xmlfile-for-user-button-cell.component.scss']
})
export class GenerateXMLFileForUSerButtonCellComponent implements ICellRendererAngularComp {

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
