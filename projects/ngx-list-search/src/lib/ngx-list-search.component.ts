import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Host, Input, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatList, MatSelectionList } from '@angular/material/list';
import { Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'ngx-list-search',
  templateUrl: './ngx-list-search.component.html',
  styles: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxListSearchComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxListSearchComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  _formControl: FormControl = new FormControl('');
  @Input() public placeholder: string = 'Search...';

  public observer: MutationObserver | undefined;

  public destroy$: Subject<void> = new Subject();

  private _lastExternalInputValue: string | undefined;

  onTouched: Function = (_: any) => { };

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
    if (this.matList instanceof MatList) {
      this.observableChangesToMatListItems();
      this._formControl?.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => {
        if (this.matList instanceof MatList) {
          this.searchMatList();
        }
      });
    }
  }

  /**
   * When the elementRef nativeElement is changed use mutation observer to detect changes.
   * 
   * @private
   * @memberof NgxListSearchComponent
   */
  private observableChangesToMatListItems() {
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

  public ngOnInit(): void {
    //
  }

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
      // If the text contains the value, show the item, otherwise hide it.
      this.renderer.setStyle(item, 'display', text.toLowerCase().includes(value.toLowerCase()) ? 'inherit' : 'none');
    });
    this.observableChangesToMatListItems();
  }

  writeValue(value: string) {
    this._lastExternalInputValue = value;
    this._formControl.setValue(value);
    this.changeDetectorRef.markForCheck();
  }

  onBlur() {
    this.onTouched();
  }

  registerOnChange(fn: (value: string) => void) {
    this._formControl.valueChanges.pipe(
      filter(value => value !== this._lastExternalInputValue),
      tap(() => this._lastExternalInputValue = undefined),
      takeUntil(this.destroy$)
    ).subscribe(fn);
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._formControl.disable();
  }

}
