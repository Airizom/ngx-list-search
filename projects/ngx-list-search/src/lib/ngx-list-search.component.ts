import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Host, Input, OnDestroy, Optional, Renderer2, ViewChild } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { MatList, MatSelectionList } from '@angular/material/list';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  @ViewChild(FormControlDirective, { static: true }) formControlDirective!: FormControlDirective;

  @Input() formControl: FormControl = new FormControl('');
  @Input() formControlName: string | undefined;

  public get control(): FormControl {
    return this.formControlName ? this.controlContainer.control?.get(this.formControlName) as FormControl : this.formControl;
  }

  @Input() public placeholder: string = 'Search...';
  @Input() public notFoundMessage: string = 'No results found';
  @Input() public appearance: MatFormFieldAppearance = 'fill';

  public observer: MutationObserver | undefined;

  public destroy$: Subject<void> = new Subject();

  public resultsFound: boolean = true;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Host() @Optional() private readonly matList: MatList,
    @Host() @Optional() private readonly matSelectionList: MatSelectionList,
    @Optional() private readonly controlContainer: ControlContainer
  ) {
    //
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngAfterViewInit(): void {
    if (this.control.value) {
      this.searchList();
    }
    this.control.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchList();
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

  /**
   * Determine how the list will be searched based on list type
   *
   * @private
   * @memberof NgxListSearchComponent
   */
  private searchList(): void {
    if (this.matList instanceof MatList) {
      this.searchMatList();
    }
    if (this.matSelectionList instanceof MatSelectionList) {
      this.searchMatSelectionListOptions();
    }
  }

  private searchMatSelectionListOptions(): void {
    this.resultsFound = false;
    const options = this.matSelectionList.options.toArray();
    // Iterate over all the options and if the text contains the value, show the item, otherwise hide it.
    options.forEach(option => {
      const text = option.getLabel().toLowerCase();
      const value = this.control.value.toLowerCase();
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
  private observeChangesToMatListItems(): void {
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
  public clearSearch(): void {
    this.control.setValue('');
  }

  /**
   * Search the MatList items.
   *
   * @returns
   * @memberof NgxListSearchComponent
   */
  public searchMatList(): void {
    this.resultsFound = false;
    // Get a reference to all the mat-list-items in the parent mat-list.
    const items: NodeListOf<HTMLElement> | undefined = this.getMatListItems();
    // If there are no items, return.
    if (!items) {
      return;
    }
    // Get the value of the input.
    const value = this.control.value || '';
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

  /**
   * Query the DOM for the Angular mat-list-item elements
   *
   * @returns {(NodeListOf<HTMLElement> | undefined)}
   * @memberof NgxListSearchComponent
   */
  public getMatListItems(): NodeListOf<HTMLElement> | undefined {
    return this.elementRef.nativeElement.parentElement?.querySelectorAll('mat-list-item');
  }

  public registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  public registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  public writeValue(obj: any): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }

  public setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor?.setDisabledState?.(isDisabled);
  }

}
