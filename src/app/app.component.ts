import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { State } from 'country-state-city';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public formControl = new FormControl();

  public states = State.getStatesOfCountry('US');

}
