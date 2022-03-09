import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Host, Input, OnDestroy, Optional, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatList, MatSelectionList } from '@angular/material/list';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'ngx-list-search',
  templateUrl: './ngx-list-search.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxListSearchComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxListSearchComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  _formControl: FormControl = new FormControl('');

  @Input() public placeholder: string = 'Search...';
  @Input() public notFoundMessage: string = 'No results found';
  @Input() public appearance: MatFormFieldAppearance = 'fill';

  public observer: MutationObserver | undefined;

  public destroy$: Subject<void> = new Subject();

  public resultsFound: boolean = true;

  private _lastExternalInputValue: string | undefined;

  onTouched: Function = () => {
    this._formControl.markAsTouched();
  };

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Host() @Optional() private readonly matList: MatList,
    @Host() @Optional() private readonly matSelectionList: MatSelectionList
  ) {
    //
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngAfterViewInit(): void {
    this._formControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.matList instanceof MatList) {
        this.searchMatList();
      }
      if (this.matSelectionList instanceof MatSelectionList) {
        this.searchMatSelectionListOptions();
      }
    });
    if (this.matList instanceof MatList) {
      this.observeChangesToMatListItems();
    }
    if (this.matSelectionList instanceof MatSelectionList) {
      merge(
        this.matSelectionList.selectionChange,
        this.matSelectionList.options.changes
      ).pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.searchMatSelectionListOptions();
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  private searchMatSelectionListOptions() {
    this.resultsFound = false;
    const options = this.matSelectionList.options.toArray();
    // Iterate over all the options and if the text contains the value, show the item, otherwise hide it.
    options.forEach(option => {
      const text = option.getLabel().toLowerCase();
      const value = this._formControl.value.toLowerCase();
      const shouldShow = text.includes(value);
      if (shouldShow) {
        this.resultsFound = true;
      }
      this.renderer.setStyle(option._getHostElement(), 'display', shouldShow ? 'inherit' : 'none');
    });
  }

  /**
   * When the elementRef nativeElement is changed use mutation observer to detect changes.
   * 
   * @private
   * @memberof NgxListSearchComponent
   */
  private observeChangesToMatListItems() {
    if (!this.elementRef.nativeElement.parentElement) {
      return;
    }
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.searchMatList();
    });
    this.observer.observe(this.elementRef.nativeElement.parentElement, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true
    });
  }

  /**
   * Event fired when the clear icon is selected.
   * Clears the input.
   *
   * @memberof NgxListSearchComponent
   */
  public clearSearch() {
    this._formControl.setValue('');
  }

  /**
   * Search the MatList items.
   *
   * @returns
   * @memberof NgxListSearchComponent
   */
  public searchMatList() {
    this.resultsFound = false;
    // Get a reference to all the mat-list-items in the parent mat-list.
    const items: NodeListOf<HTMLElement> | undefined = this.elementRef.nativeElement.parentElement?.querySelectorAll('mat-list-item');
    // If there are no items, return.
    if (!items) {
      return;
    }
    // Get the value of the input.
    const value = this._formControl.value || '';
    this.observer?.disconnect();
    items.forEach(item => {
      const text = item.innerText;
      const shouldShow = text.toLowerCase().includes(value.toLowerCase());
      if (shouldShow) {
        this.resultsFound = true;
      }
      // If the text contains the value, show the item, otherwise hide it.
      this.renderer.setStyle(item, 'display', shouldShow ? 'inherit' : 'none');
    });
    this.changeDetectorRef.detectChanges();
    this.observeChangesToMatListItems();
  }

  public writeValue(value: string) {
    this._lastExternalInputValue = value;
    this._formControl.setValue(value);
    this.onTouched();
    this.changeDetectorRef.markForCheck();
  }

  public registerOnChange(fn: (value: string) => void) {
    this._formControl.valueChanges.pipe(
      filter(value => value !== this._lastExternalInputValue),
      tap(() => this._lastExternalInputValue = undefined),
      takeUntil(this.destroy$)
    ).subscribe(fn);
  }

  public registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this._formControl.disable() : this._formControl.enable();
  }

}
