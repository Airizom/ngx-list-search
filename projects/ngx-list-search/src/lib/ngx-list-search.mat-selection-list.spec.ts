import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule, MatListOption } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { State } from 'country-state-city';
import { IState } from 'country-state-city/dist/lib/interface';
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
    let states: IState[];
    beforeEach(() => {
        states = State.getStatesOfCountry('US');
        spectator = createHost(`
      <mat-selection-list>
        <ngx-list-search [placeholder]="'Search states...'"></ngx-list-search>
        <mat-list-option *ngFor="let item of states">
          {{ item.name }}
        </mat-list-option>
      </mat-selection-list>
    `, {
            hostProps: {
                states
            }
        });
    });

    it('should create', () => {
        expect(spectator.component).toBeTruthy();
    });

    it('should display placeholder', () => {
        // Find the matLabel component
        const matLabel = spectator.query('mat-label');
        // Expect the matLabel to have the placeholder text
        expect(matLabel?.textContent?.trim()).toBe('Search states...');
    });

    it('should search the list of states when input changes', () => {
        // Type in the input
        spectator.typeInElement('texas', 'input');
        // Get a list of mat-list-item components
        const items = spectator.fixture.debugElement.queryAll(By.directive(MatListOption));
        // Expect the list of items to have one item that is not hidden
        expect(items.filter(item => item.nativeElement.style.display !== 'none').length).toBe(1);
    });

    it('should clear the input when the clear icon is clicked', () => {
        // Type in the input
        spectator.typeInElement('texas', 'input');
        // Expect the input to have the value
        expect(spectator.query<HTMLInputElement>('input')?.value).toBe('texas');
        // Click the clear icon
        spectator.click('.ngx-list-search-clear-icon');
        // Expect the input to be empty
        expect(spectator.query<HTMLInputElement>('input')?.value).toBe('');
    });

    it('should show all the items when the list is searched and then cleared', () => {
        // Type in the input
        spectator.typeInElement('texas', 'input');
        // Get a list of mat-list-item components
        const items = spectator.fixture.debugElement.queryAll(By.directive(MatListOption));
        // Expect the list of items to have one item that is not hidden
        expect(items.filter(item => item.nativeElement.style.display !== 'none').length).toBe(1);

        // Clear the input
        spectator.click('.ngx-list-search-clear-icon');
        // Expect the list of items to have all the items
        expect(items.filter(item => item.nativeElement.style.display !== 'none').length).toBe(items.length);
    });

    it('should show the no result message when search fails to find an item', () => {
        // Type in the input
        spectator.typeInElement('abcdef', 'input');
        // Expect the no result message to be visible
        expect(spectator.query<HTMLElement>('.ngx-list-search-no-results')?.style.display).toBe('');
    });

    it('should not show the no result message when search finds an item', () => {
        // Type in the input
        spectator.typeInElement('alaska', 'input');
        // Expect the no result message to be hidden
        expect(spectator.query<HTMLElement>('.ngx-list-search-no-results')?.style.display).toBeUndefined();
    });

    it('should show the searched item when the list is searched and then when item is removed from list not show it', async () => {
        // Type in the input
        spectator.typeInElement('texas', 'input');
        // Get a list of mat-list-item components
        const items = spectator.fixture.debugElement.queryAll(By.directive(MatListOption));
        // Expect the list of items to have one item that is not hidden
        expect(items.filter(item => item.nativeElement.style.display !== 'none').length).toBe(1);

        // Find the texas item in the states array and then remove it
        const texasItem = states.find(item => item.name === 'Texas');
        if (texasItem) {
            states.splice(states.indexOf(texasItem), 1);
        }
        spectator.detectChanges();

        const newItems = spectator.fixture.debugElement.queryAll(By.directive(MatListOption));

        // Expect the list of items to that are shown to be zero
        expect(newItems.filter(item => item.nativeElement.style.display !== 'none').length).toBe(0);
    });

});
