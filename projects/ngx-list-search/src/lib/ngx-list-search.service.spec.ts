import { TestBed } from '@angular/core/testing';

import { NgxListSearchService } from './ngx-list-search.service';

describe('NgxListSearchService', () => {
  let service: NgxListSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxListSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
