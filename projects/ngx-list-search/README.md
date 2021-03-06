# NgxListSearch

[![Coverage Status](https://coveralls.io/repos/github/Airizom/ngx-list-search/badge.svg?branch=main)](https://coveralls.io/github/Airizom/ngx-list-search?branch=main)

## About
Angular list search drop in component to provide searching on MatList, MatActionList and MatSelectionList [MatList](https://material.angular.io/components/list/overview)

## Usage
Install `ngx-list-search` in your project:
```
npm install ngx-list-search
```

Import `NgxListSearchModule` e.g. in your `app.module.ts`:
```typescript
import { MatListModule } from '@angular/material/list';
import { NgxListSearchModule } from 'ngx-list-search';

@NgModule({
  imports: [
    ...
    MatListModule,
    NgxListSearchModule
  ],
})
export class AppModule {}
```

Use the `ngx-list-search` component inside a `mat-list` element:
```html
<mat-list>
    <ngx-list-search></ngx-list-search>
    <mat-list-item *ngFor="let item of items">
        {{ item }}
    </mat-list-item>
</mat-list>
```

## Demo
To see a working demo, please visit [https://ngx-list-search.com/](https://ngx-list-search.com/)

## Limitations
All searchable items must be in the DOM and not rendered with virtual scrolling.
