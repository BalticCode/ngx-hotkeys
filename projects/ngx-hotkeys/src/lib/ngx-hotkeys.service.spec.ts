import { TestBed, inject } from '@angular/core/testing';

import { NgxHotkeysService } from './ngx-hotkeys.service';

describe('NgxHotkeysService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxHotkeysService]
    });
  });

  it('should be created', inject([NgxHotkeysService], (service: NgxHotkeysService) => {
    expect(service).toBeTruthy();
  }));
});
