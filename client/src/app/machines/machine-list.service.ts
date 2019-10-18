import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Machine} from './machine';
import {environment} from '../../environments/environment';


@Injectable()
export class MachineListService {
  readonly baseUrl: string = environment.API_URL + 'machines';
  private machineUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getMachines(machineRoom_id?: string): Observable<Machine[]> {
    this.filterByRoom_id(machineRoom_id);
    return this.http.get<Machine[]>(this.machineUrl);
  }

  getMachineById(id: string): Observable<Machine> {
    return this.http.get<Machine>(this.machineUrl + '/' + id);
  }

  public filterMachines(machines: Machine[], searchType: string, searchRunning: string, searchRoom_id: string, searchStatus: string): Machine[] {

    let filteredMachines = machines;

    // Filter by type
    if (searchType != null) {
      searchType = searchType.toLocaleLowerCase();
      filteredMachines = filteredMachines.filter(machine => {
        return !searchType || machine.type.toLowerCase().indexOf(searchType) !== -1;
      })};


    // Filter by running
    if (searchRunning != null) {
      if (searchRunning == "true") {
      filteredMachines = filteredMachines.filter(machine => {
        return machine.running == true;
      })};
      if (searchRunning == "false") {
        filteredMachines = filteredMachines.filter(machine => {
          return machine.running == false;
        })}};

    if (searchRoom_id != null) {
      searchRoom_id = searchRoom_id.toLocaleLowerCase()
      filteredMachines = filteredMachines.filter(machine => {
        return !searchRoom_id || machine.room_id == searchRoom_id;
      })};

      if (searchStatus != null) {
        searchStatus = searchStatus.toLocaleLowerCase()
        filteredMachines = filteredMachines.filter(machine => {
          return machine.status.toLowerCase().indexOf(searchStatus) !== -1;
        })};

    return filteredMachines;
  }

  /*
  //This method looks lovely and is more compact, but it does not clear previous searches appropriately.
  //It might be worth updating it, but it is currently commented out since it is not used (to make that clear)
  getMachinesByRoom_id(machineRoom_id?: string): Observable<Machine> {
      this.machineUrl = this.machineUrl + (!(machineRoom_id == null || machineRoom_id == "") ? "?room_id=" + machineRoom_id : "");
      console.log("The url is: " + this.machineUrl);
      return this.http.request(this.machineUrl).map(res => res.json());
  }
  */

  filterByRoom_id(machineRoom_id?: string): void {
    if (!(machineRoom_id == null || machineRoom_id === '')) {
      if (this.parameterPresent('room_id=')) {
        // there was a previous search by room_id that we need to clear
        this.removeParameter('room_id=');
      }
      if (this.machineUrl.indexOf('?') !== -1) {
        // there was already some information passed in this url
        this.machineUrl += 'room_id=' + machineRoom_id + '&';
      } else {
        // this was the first bit of information to pass in the url
        this.machineUrl += '?room_id=' + machineRoom_id + '&';
      }
    } else {
      // there was nothing in the box to put onto the URL... reset
      if (this.parameterPresent('room_id=')) {
        let start = this.machineUrl.indexOf('room_id=');
        const end = this.machineUrl.indexOf('&', start);
        if (this.machineUrl.substring(start - 1, start) === '?') {
          start = start - 1;
        }
        this.machineUrl = this.machineUrl.substring(0, start) + this.machineUrl.substring(end + 1);
      }
    }
  }

  private parameterPresent(searchParam: string) {
    return this.machineUrl.indexOf(searchParam) !== -1;
  }

  //remove the parameter and, if present, the &
  private removeParameter(searchParam: string) {
    let start = this.machineUrl.indexOf(searchParam);
    let end = 0;
    if (this.machineUrl.indexOf('&') !== -1) {
      end = this.machineUrl.indexOf('&', start) + 1;
    } else {
      end = this.machineUrl.indexOf('&', start);
    }
    this.machineUrl = this.machineUrl.substring(0, start) + this.machineUrl.substring(end);
  }
}
