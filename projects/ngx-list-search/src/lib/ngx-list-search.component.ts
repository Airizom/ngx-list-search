import { AfterViewInit, Component, ElementRef, Host, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
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
    private readonly renderer: Renderer2,
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
    if (!this.elementRef.nativeElement.parentElement) {
      return;
    }
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      console.log('MutationObserver detected a change in the MatList.', mutations);
      this.searchMatList();
    });
    this.observer.observe(this.elementRef.nativeElement.parentElement, {
      attributes: false,
      childList: true,
      characterData: false,
      subtree: true
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
    this.observer?.disconnect();
    items.forEach(item => {
      const text = item.innerText;
      // If the text contains the value, show the item, otherwise hide it.
      this.renderer.setStyle(item, 'display', text.toLowerCase().includes(value.toLowerCase()) ? 'inherit' : 'none');
    });
    this.observableChangesToMatListItems();
  }
}
