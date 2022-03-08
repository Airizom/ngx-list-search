import { ReactiveFormsModule } from '@angular/forms';
import { MatListItem, MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { State } from 'country-state-city';
import { IState } from 'country-state-city/dist/lib/interface';
import { NgxListSearchComponent } from './ngx-list-search.component';
import { NgxListSearchModule } from './ngx-list-search.module';

// <mat-form-field [appearance]="appearance"
//                 [ngStyle]="{'min-width': '250px'}">
//     <mat-label>
//         {{ placeholder }}
//     </mat-label>

//     <mat-icon matPrefix>search</mat-icon>

//     <input matInput
//            (keydown)="$event.stopPropagation()"
//            [formControl]="_formControl">

//     <mat-icon *ngIf="_formControl.value"
//               [ngStyle]="{'cursor': 'pointer'}"
//               matSuffix
//               (click)="clearSearch()">
//         close
//     </mat-icon>
// </mat-form-field>

// <p [ngStyle]="{'padding': '0 16px'}"
//    *ngIf="notFoundMessage && !resultsFound">
//     {{ notFoundMessage }}
// </p>

// @Component({
//   selector: 'ngx-list-search',
//   templateUrl: './ngx-list-search.component.html',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => NgxListSearchComponent),
//       multi: true
//     }
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush
// })
// export class NgxListSearchComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

//   _formControl: FormControl = new FormControl('');

//   @Input() public placeholder: string = 'Search...';
//   @Input() public notFoundMessage: string = 'No results found';
//   @Input() public appearance: MatFormFieldAppearance = 'fill';

//   public observer: MutationObserver | undefined;

//   public destroy$: Subject<void> = new Subject();

//   public resultsFound: boolean = true;

//   private _lastExternalInputValue: string | undefined;

//   onTouched: Function = (_: any) => { };

//   constructor(
//     private readonly elementRef: ElementRef<HTMLElement>,
//     private readonly renderer: Renderer2,
//     private readonly changeDetectorRef: ChangeDetectorRef,
//     @Host() @Optional() private readonly matList: MatList,
//     @Host() @Optional() private readonly matSelectionList: MatSelectionList
//   ) {
//     //
//   }

//   public ngOnDestroy(): void {
//     this.observer?.disconnect();
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   public ngAfterViewInit(): void {
//     this._formControl?.valueChanges.pipe(
//       takeUntil(this.destroy$)
//     ).subscribe(() => {
//       if (this.matList instanceof MatList) {
//         this.searchMatList();
//       }
//       if (this.matSelectionList instanceof MatSelectionList) {
//         this.searchMatSelectionListOptions();
//       }
//     });
//     if (this.matList instanceof MatList) {
//       this.observeChangesToMatListItems();
//     }
//     if (this.matSelectionList instanceof MatSelectionList) {
//       merge(
//         this.matSelectionList.selectionChange,
//         this.matSelectionList.options.changes
//       ).pipe(
//         takeUntil(this.destroy$)
//       ).subscribe(() => {
//         this.searchMatSelectionListOptions();
//         this.changeDetectorRef.markForCheck();
//       });
//     }
//   }

//   private searchMatSelectionListOptions() {
//     this.resultsFound = false;
//     const options = this.matSelectionList.options.toArray();
//     // Iterate over all the options and if the text contains the value, show the item, otherwise hide it.
//     options.forEach(option => {
//       const text = option.getLabel()?.toLowerCase() || '';
//       const value = this._formControl?.value?.toLowerCase() || '';
//       const shouldShow = text.includes(value);
//       if (shouldShow) {
//         this.resultsFound = true;
//       }
//       this.renderer.setStyle(option._getHostElement(), 'display', shouldShow ? 'inherit' : 'none');
//     });
//   }

//   /**
//    * When the elementRef nativeElement is changed use mutation observer to detect changes.
//    * 
//    * @private
//    * @memberof NgxListSearchComponent
//    */
//   private observeChangesToMatListItems() {
//     if (!this.elementRef.nativeElement.parentElement) {
//       return;
//     }
//     this.observer = new MutationObserver((mutations: MutationRecord[]) => {
//       this.searchMatList();
//     });
//     this.observer.observe(this.elementRef.nativeElement.parentElement, {
//       attributes: false,
//       childList: true,
//       characterData: false,
//       subtree: true
//     });
//   }

//   /**
//    * Event fired when the clear icon is selected.
//    * Clears the input.
//    *
//    * @memberof NgxListSearchComponent
//    */
//   public clearSearch() {
//     this._formControl.setValue('');
//   }

//   /**
//    * Search the MatList items.
//    *
//    * @returns
//    * @memberof NgxListSearchComponent
//    */
//   public searchMatList() {
//     this.resultsFound = false;
//     // Get a reference to all the mat-list-items in the parent mat-list.
//     const items: NodeListOf<HTMLElement> | undefined = this.elementRef.nativeElement.parentElement?.querySelectorAll('mat-list-item');
//     // If there are no items, return.
//     if (!items) {
//       return;
//     }
//     // Get the value of the input.
//     const value = this._formControl.value || '';
//     this.observer?.disconnect();
//     items.forEach(item => {
//       const text = item.innerText;
//       const shouldShow = text.toLowerCase().includes(value.toLowerCase());
//       if (shouldShow) {
//         this.resultsFound = true;
//       }
//       // If the text contains the value, show the item, otherwise hide it.
//       this.renderer.setStyle(item, 'display', shouldShow ? 'inherit' : 'none');
//     });
//     this.changeDetectorRef.detectChanges();
//     this.observeChangesToMatListItems();
//   }

//   public writeValue(value: string) {
//     this._lastExternalInputValue = value;
//     this._formControl.setValue(value);
//     this.changeDetectorRef.markForCheck();
//   }

//   public onBlur() {
//     this.onTouched();
//   }

//   public registerOnChange(fn: (value: string) => void) {
//     this._formControl.valueChanges.pipe(
//       filter(value => value !== this._lastExternalInputValue),
//       tap(() => this._lastExternalInputValue = undefined),
//       takeUntil(this.destroy$)
//     ).subscribe(fn);
//   }

//   public registerOnTouched(fn: Function) {
//     this.onTouched = fn;
//   }

//   public setDisabledState?(isDisabled: boolean): void {
//     this._formControl.disable();
//   }

// }

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
    const items = spectator.fixture.debugElement.queryAll(By.directive(MatListItem));
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
    const items = spectator.fixture.debugElement.queryAll(By.directive(MatListItem));
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
    const items = spectator.fixture.debugElement.queryAll(By.directive(MatListItem));
    // Expect the list of items to have one item that is not hidden
    expect(items.filter(item => item.nativeElement.style.display !== 'none').length).toBe(1);

    // Find the texas item in the states array and then remove it
    const texasItem = states.find(item => item.name === 'Texas');
    if (texasItem) {
      states.splice(states.indexOf(texasItem), 1);
    }
    spectator.detectChanges();

    const newItems = spectator.fixture.debugElement.queryAll(By.directive(MatListItem));

    // Expect the list of items to that are shown to be zero
    expect(newItems.filter(item => item.nativeElement.style.display !== 'none').length).toBe(0);
  });

});
