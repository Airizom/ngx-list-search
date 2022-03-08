import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { State } from 'country-state-city';
import { NgxListSearchComponent } from './ngx-list-search.component';
import { NgxListSearchModule } from './ngx-list-search.module';

describe('NgxListSearchComponent', () => {
  let spectator: SpectatorHost<NgxListSearchComponent>;
  // Create host component with NgxListSearchComponent and MatListModule
  const createHost = createHostFactory({
    component: NgxListSearchComponent,
    imports: [
      NgxListSearchModule,
      MatListModule,
      ReactiveFormsModule
    ]
  });

  const states = State.getStatesOfCountry('US');
  beforeEach(() => {
    spectator = createHost(`
      <mat-list>
        <ngx-list-search [placeholder]="'Search states...'"></ngx-list-search>
        <mat-list-item *ngFor="let item of states">
          {{ item.name }}
        </mat-list-item>
      </mat-list>
    `, {
      hostProps: {
        states
      }
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
