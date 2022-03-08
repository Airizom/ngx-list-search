import { AfterViewInit, Component, ElementRef, Host, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatList } from '@angular/material/list';
@Component({
  selector: 'ngx-list-search',
  templateUrl: './ngx-list-search.component.html',
  styles: []
})
export class NgxListSearchComponent implements OnInit, AfterViewInit {

  @Input() formControl: FormControl = new FormControl();
  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Host() private readonly host: MatList
  ) {
    //
  }
  ngAfterViewInit(): void {
    this.formControl?.valueChanges.subscribe(() => {
      if (this.host instanceof MatList) {
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
    });
  }

  ngOnInit(): void {
  }

  clearSearch() {
    this.formControl.setValue('');
  }

}
