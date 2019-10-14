import {Component, OnInit} from '@angular/core';
import {MachineListService} from './machine-list.service';
import {Machine} from './machine';
import {Observable} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'machine-list-component',
  templateUrl: 'machine-list.component.html',
  styleUrls: ['./machine-list.component.css'],
})

export class MachineListComponent implements OnInit {
  // These are public so that tests can reference them (.spec.ts)
  public machines: Machine[];
  public filteredMachines: Machine[];

  // These are the target values used in searching.
  // We should rename them to make that clearer.
  public machineType: string;
  public machineRunning: boolean;
  public machineRoom_id: string;

  // The ID of the
  private highlightedID: string = '';

  // Inject the MachineListService into this component.
  constructor(public machineListService: MachineListService, public dialog: MatDialog) {

  }

  isHighlighted(machine: Machine): boolean {
    return machine.id['$oid'] === this.highlightedID;
  }

  public updateType(newType: string): void {
    this.machineType = newType;
    this.updateFilter();
  }

  public updateRunning(newRunning:boolean): void {
    this.machineRunning = newRunning;
    this.updateFilter();
  }

  public updateRoom_id(newRoom_id: string): void {
    this.machineRoom_id = newRoom_id;
    this.updateFilter();
  }

  public updateFilter() {
    this.filteredMachines =
      this.machineListService.filterMachines(
        this.machines,
        this.machineType,
        this.machineRunning,
        this.machineRoom_id
      );
  }

  /**
   * Starts an asynchronous operation to update the machines list
   *
   */
  refreshMachines(): Observable<Machine[]> {
    // Get Machines returns an Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)

    const machines: Observable<Machine[]> = this.machineListService.getMachines();
    machines.subscribe(
      machines => {
        this.machines = machines;
        this.updateFilter();
      },
      err => {
        console.log(err);
      });
    return machines;
  }

  loadService(): void {
    this.machineListService.getMachines(this.machineRoom_id).subscribe(
      machines => {
        this.machines = machines;
        this.filteredMachines = this.machines;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshMachines();
    this.loadService();
  }
}
