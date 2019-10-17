import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {Machine} from './machine';
import {MachineListComponent} from './machine-list.component';
import {MachineListService} from './machine-list.service';
import {Observable} from 'rxjs/Observable';
import {FormsModule} from '@angular/forms';
import {CustomModule} from '../custom.module';


import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

describe('Machine list', () => {

  let machineList: MachineListComponent;
  let fixture: ComponentFixture<MachineListComponent>;

  let machineListServiceStub: {
    getMachines: () => Observable<Machine[]>
  };

  beforeEach(() => {
    // stub MachineService for test purposes
    machineListServiceStub = {
      getMachines: () => Observable.of([
        {
          id: 'washer1_id',
          name:'Washer1',
          type: 'Washer',
          running: true,
          status: 'Malfunctioning',
          position: {
            x: 0,
            y: 0,
          },
          room_id: 'gay_hall'
        },
        {
          id: 'washer2_id',
          name: 'Washer2',
          type: 'Washer',
          running: false,
          status: 'Functioning',
          position: {
            x: 0,
            y: 0,
          },
          room_id: 'spooner_hall'
        },
        {
          id: 'Dryer_id',
          name: 'Dryer',
          type: 'Dryer',
          running: true,
          status: 'Functional',
          position: {
            x: 0,
            y: 0,
          },
          room_id: 'blakely_hall'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [MachineListComponent],
      // providers:    [ MachineListService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{provide: MachineListService, useValue: machineListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(MachineListComponent);
      machineList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));






});

describe('Misbehaving Machine List', () => {
  let machineList: MachineListComponent;
  let fixture: ComponentFixture<MachineListComponent>;

  let machineListServiceStub: {
    getMachines: () => Observable<Machine[]>
  };

  beforeEach(() => {
    // stub MachineService for test purposes
    machineListServiceStub = {
      getMachines: () => Observable.create(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, CustomModule],
      declarations: [MachineListComponent],
      providers: [{provide: MachineListService, useValue: machineListServiceStub}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(MachineListComponent);
      machineList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // it('generates an error if we don\'t set up a MachineListService', () => {
  //   // Since the observer throws an error, we don't expect machines to be defined.
  //   expect(machineList.machines).toBeUndefined();
  // });
});
