import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IGetRowsParams } from 'ag-grid-community';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SelfUnsubscriberBase } from 'src/app/utils/SelfUnsubscriberBase';
import { DeleteButtonCellComponent } from './delete-button-cell/delete-button-cell.component';
import { AppConstants } from 'src/app/constants/AppConstants';
import { UserSearchDto } from 'src/app/models/User/UserSearchDto';
import { GetUserActivitiesDto } from 'src/app/models/UserAcitivity/GetUserActivitiesDto';
import { UserActivityService } from 'src/app/services/user-activity.service';
import { GetUserActivitiesButtonCellComponent } from './get-user-activities-button-cell/get-user-activities-button-cell.component';
import { GenerateXMLFileForUSerButtonCellComponent } from './generate-xmlfile-for-user-button-cell/generate-xmlfile-for-user-button-cell.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent extends SelfUnsubscriberBase implements OnInit {
  gridApi!: GridApi;

  gridOptions!: GridOptions;

  params!: IGetRowsParams;

  rowData!: any;

  currentPage: number = 1;
  totalNumberOfPages!: number;
  totalNumberOfUsers!: number;
  currentNumberOfUsersStartRow: number = 1;
  currentNumberOfUsersEndRow!: number;

  searchedUserName: string = "";
  searchedEmail: string = "";

  title: string = 'User Manager'

  private deleteUsername!: string;

  columnDefs: ColDef[] = [
    { 
      headerName: "Username", 
      field: "username", 
      sortable: true,
    },
    { 
      headerName: "Email", 
      field: "email", 
      sortable: true,
    },
    {
      headerName: "First Name",
      field: "firstName",
      sortable: true, 
    },
    {
      headerName: "Last Name",
      field: "lastName",
      sortable: true,
    },
    {
      headerName: "Delete",
      field: "delete",
      sortable: false,
      cellRenderer: DeleteButtonCellComponent,
      cellRendererParams: {
        clicked: (username:string ) => {
          this.deleteUsername = username;
          this.changeShowDeleteUser();
        }
      }
    },
    {
      headerName: "Activities",
      field: "activities",
      sortable: false,
      cellRenderer: GetUserActivitiesButtonCellComponent,
      cellRendererParams: {
        clicked: (username: string) => {
          this.getUserActivities(username);
          this.changeShowUserActivities();
        }
      }
    },
    {
      headerName: "GenerateXML",
      field: "generateXML",
      cellRenderer: GenerateXMLFileForUSerButtonCellComponent,
      cellRendererParams: {
        clicked: (username: string) => {
          this.generateXMLFileForUser(username);
        }
      }
    }
  ]

  public defaultColDef: ColDef = {
    editable: false,
    resizable: false, 
  };

  isShownDeleteUser: boolean = false;

  isShownUserActivities: boolean = false;

  userActivitiesdDto: GetUserActivitiesDto;

  constructor(
    private userService : UserService,
    private userActivityService: UserActivityService,
    private titleService: Title,
  ){
    super();

    this.gridOptions = <GridOptions>{
      rowModelType: "clientSide",
      pagination: true,
      paginationPageSize: AppConstants.USERS_PER_PAGE,
      suppressPaginationPanel: true,
      suppressScrollOnNewData: true,
      cacheBlockSize: 10
    };

    this.userActivitiesdDto = new GetUserActivitiesDto();
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title)
  }

  onGridReady(params: GridReadyEvent){
    this.gridApi = params.api;
    this.userService.getUsersPaginated(this.currentPage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.rowData = result.getSearchedUserDto;
        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;
        this.currentNumberOfUsersEndRow = this.rowData.length;
      })
  }

  changeShowDeleteUser() {
    this.isShownDeleteUser = !this.isShownDeleteUser;
  }

  changeShowUserActivities(){
    this.isShownUserActivities = !this.isShownUserActivities;
  }

  deleteUser(){
    this.userService.deleteUser(this.deleteUsername)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeShowDeleteUser();
        if(this.searchedUserName){
          this.getSearchedUsersByUserName(0);
        }

        if(this.searchedEmail){
          this.getSearchedUsersByEmail(0);
        }

        if(!this.searchedEmail && !this.searchedUserName){
          this.getPaginatedUsers(0);
        }
      });
  }

  getUserActivities(username: string){
    this.userActivityService.getUserActivitiesByUsername(username)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.userActivitiesdDto = result;
      })
  }

  generateXMLFileForUser(username: string){
    this.userService.generateXMLForUser(username)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe()
  }


  nextPage(){
    this.currentPage++;
    
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(1);
    }

    if(this.searchedUserName){
     this.getSearchedUsersByUserName(1)
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(1);
    }

  }

  lastPage(){
    this.currentPage = this.totalNumberOfPages;

    if(this.searchedEmail){
      this.getSearchedUsersByEmail(2);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(2);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(2);
    }
  }

  previousPage(){
    this.currentPage--;
  
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(-1);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-1);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(-1);
    }
  }

  firstPage(){
    this.currentPage = 1;
    
    if(this.searchedEmail){
      this.getSearchedUsersByEmail(-2);
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-2);
    }

    if(!this.searchedEmail && !this.searchedUserName){
      this.getPaginatedUsers(-2);
    }
  }

  onSearchByUserName(){
    this.currentPage = 1;

    if(this.searchedEmail){
      this.searchedEmail = "";
    }

    if(this.searchedUserName){
      this.getSearchedUsersByUserName(-2);
    }
    else{
      this.getPaginatedUsers(-2);
    }
  }

  onSearchByEmail(){
    this.currentPage = 1;

    if(this.searchedUserName){
      this.searchedUserName = "";
    }

    if(this.searchedEmail){
     this.getSearchedUsersByEmail(-2);
    }
    else{
      this.getPaginatedUsers(-2);
    }
  }

  getPaginatedUsers(direction: number){
    console.log(this.currentPage);
    this.userService.getUsersPaginated(this.currentPage)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getSearchedUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getSearchedUserDto;
      })
  }

  getSearchedUsersByUserName(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.page = this.currentPage;
    searchedUsers.search = this.searchedUserName;

    this.userService.getSearchedUsersByUserName(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getSearchedUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getSearchedUserDto;
      })
    }

  getSearchedUsersByEmail(direction: number){
    var searchedUsers = new UserSearchDto();
    searchedUsers.page = this.currentPage;
    searchedUsers.search = this.searchedEmail;

    this.userService.getSearchedUsersByEmail(searchedUsers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        var numberOfNewUsers = result.getSearchedUserDto.length;
        var numberOfOldUsers = this.rowData.length;

        this.totalNumberOfPages = result.numberOfPages;
        this.totalNumberOfUsers = result.numberOfUsers;

        switch(direction){
          case -2:
            this.currentNumberOfUsersStartRow = 1;
            this.currentNumberOfUsersEndRow = numberOfNewUsers;
            break;
          case -1:
            this.currentNumberOfUsersEndRow -= numberOfOldUsers;
            this.currentNumberOfUsersStartRow -= numberOfNewUsers ;
            break;
          case 1:
            this.currentNumberOfUsersStartRow += numberOfOldUsers;
            this.currentNumberOfUsersEndRow += numberOfNewUsers;
            break;
          case 2:
            this.currentNumberOfUsersStartRow = this.totalNumberOfUsers - numberOfNewUsers + 1;
            this.currentNumberOfUsersEndRow = this.totalNumberOfUsers;
            break;
          default:
            this.currentNumberOfUsersStartRow = 0;
            this.currentNumberOfUsersEndRow = numberOfOldUsers;
        }
        this.rowData = result.getSearchedUserDto;
      })
  }

}
