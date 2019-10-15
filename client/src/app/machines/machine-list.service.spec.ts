import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Machine} from './machine';
import {MachineListService} from './machine-list.service';

describe('Machine list service: ', () => {
  // A small collection of test machines
  const testMachines: Machine[] = [
      {
        _id: 'washer1_id',
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
        _id: 'washer2_id',
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
        _id: 'Dryer_id',
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
    ];
  const mMachines: Machine[] = testMachines.filter(machine =>
    machine.status.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the machineListService to meaningfully test status filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let machineListService: MachineListService;
  let currentlyImpossibleToGenerateSearchMachineUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    machineListService = new MachineListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getMachines() calls api/machines', () => {
    // Assert that the machines we get from this call to getMachines()
    // should be our set of test machines. Because we're subscribing
    // to the result of getMachines(), this won't actually get
    // checked until the mocked HTTP request "returns" a response.
    // This happens when we call req.flush(testMachines) a few lines
    // down.
    machineListService.getMachines().subscribe(
      machines => expect(machines).toBe(testMachines)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(machineListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testMachines);
  });

  it('getMachines(machineroom_id) adds appropriate param string to called URL', () => {
    machineListService.getMachines('m').subscribe(
      machines => expect(machines).toEqual(mMachines)
    );

    const req = httpTestingController.expectOne(machineListService.baseUrl + '?room_id=m&');
    expect(req.request.method).toEqual('GET');
    req.flush(mMachines);
  });

  it('filterByroom_id(machineroom_id) deals appropriately with a URL that already had a room_id', () => {
    currentlyImpossibleToGenerateSearchMachineUrl = machineListService.baseUrl + '?room_id=f&something=k&';
    machineListService['machineUrl'] = currentlyImpossibleToGenerateSearchMachineUrl;
    machineListService.filterByRoom_id('m');
    expect(machineListService['machineUrl']).toEqual(machineListService.baseUrl + '?something=k&room_id=m&');
  });

  it('filterByRoom_id(machineRoom_id) deals appropriately with a URL that already had some filtering, but no room_id', () => {
    currentlyImpossibleToGenerateSearchMachineUrl = machineListService.baseUrl + '?something=k&';
    machineListService['machineUrl'] = currentlyImpossibleToGenerateSearchMachineUrl;
    machineListService.filterByRoom_id('m');
    expect(machineListService['machineUrl']).toEqual(machineListService.baseUrl + '?something=k&room_id=m&');
  });

  it('filterByRoom_id(machineRoom_id) deals appropriately with a URL has the keyword room_id, but nothing after the =', () => {
    currentlyImpossibleToGenerateSearchMachineUrl = machineListService.baseUrl + '?room_id=&';
    machineListService['machineUrl'] = currentlyImpossibleToGenerateSearchMachineUrl;
    machineListService.filterByRoom_id('');
    expect(machineListService['machineUrl']).toEqual(machineListService.baseUrl + '');
  });

  it('getMachineBy_id() calls api/machines/_id', () => {
    const targetMachine: Machine = testMachines[1];
    const target_id: string = targetMachine._id;
    machineListService.getMachineById(target_id).subscribe(
      machine => expect(machine).toBe(targetMachine)
    );

    const expectedUrl: string = machineListService.baseUrl + '/' + target_id;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetMachine);
  });

  it('machine list filters by type', () => {
    expect(testMachines.length).toBe(3);
    let machineType = 'a';
    expect(machineListService.filterMachines(testMachines, machineType, null, null).length).toBe(2);
  });

  it('machine list filters by running', () => {
    expect(testMachines.length).toBe(3);
    let machineRunning = true;
    expect(machineListService.filterMachines(testMachines, null, machineRunning, null).length).toBe(2);
  });

  it('machine list filters by room_id', () => {
    expect(testMachines.length).toBe(3);
    let machineRoom_id = 'spooner_hall';
    expect(machineListService.filterMachines(testMachines, null, null, machineRoom_id,).length).toBe(1);
  });

  it('machine list filters by type, running, and room_id', () => {
    expect(testMachines.length).toBe(3);
    let machineRunning = true;
    let machineType = 'a';
    let machineRoom_id = 'gay_hall'
    expect(machineListService.filterMachines(testMachines, machineType, machineRunning, machineRoom_id).length).toBe(1);
  });

  it('contains a machine of type \'Dryer\'', () => {
    expect(testMachines.some((machine: Machine) => machine.type === 'Dryer')).toBe(true);
  });

  it('contain a machine of type \'Washer\'', () => {
    expect(testMachines.some((machine: Machine) => machine.type === 'Washer')).toBe(true);
  });

  it('doesn\'t contain a machine of type \'Car\'', () => {
    expect(testMachines.some((machine: Machine) => machine.type === 'Santa')).toBe(false);
  });

  it('has two machines that are 37 years old', () => {
    expect(testMachines.filter((machine: Machine) => machine.running === true).length).toBe(2);
  });

  it('contains all the machines', () => {
    expect(testMachines.length).toBe(3);
  });

});
