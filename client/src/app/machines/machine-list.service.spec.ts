import { TestBed } from '@angular/core/testing';

import { MachineListService } from './machine-list.service';

describe('MachineListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MachineListService = TestBed.get(MachineListService);
    expect(service).toBeTruthy();
  });
});
