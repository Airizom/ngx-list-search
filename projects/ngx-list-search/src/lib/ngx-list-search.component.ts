import { AfterViewInit, Component, ElementRef, Host, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatList } from '@angular/material/list';

@Component({
  selector: 'ngx-list-search',
  templateUrl: './ngx-list-search.component.html',
  styles: []
})
export class NgxListSearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() formControl: FormControl = new FormControl();

  observer: MutationObserver | undefined;
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Host() private readonly host: MatList
  ) {
    //
  }

  public ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  public ngAfterViewInit(): void {
    if (this.host instanceof MatList) {
      this.observableChangesToMatListItems();
      this.formControl?.valueChanges.subscribe(() => {
        if (this.host instanceof MatList) {
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
    this.observer = new MutationObserver(() => {
      this.searchMatList();
    });
    this.observer.observe(this.elementRef.nativeElement, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: false
    });
  }

  ngOnInit(): void {
  }

  clearSearch() {
    this.formControl.setValue('');
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
    const value = this.formControl.value || '';
    items.forEach(item => {
      const text = item.innerText;
      item.style.display = text.toLowerCase().indexOf(value.toLowerCase()) === -1 ? 'none' : 'inherit';
    });
  }
}
