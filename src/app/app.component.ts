import { Component } from '@angular/core';
import { Padlet } from './shared/padlet';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthenticationService } from './shared/authentication.service';

/** Die (übergeordnete) app-Component lädt die Padlet-Liste rein, da der Status "list-on" grundsätzlich true ist
 * (Standartwert). Dann wählt man in der Liste ein Padlet aus und ändert dadurch den Status.
 * Dadurch weiß die App-Komponent, dass list-off ist und details-on und blendet das richtige ein/aus*/

@Component({
  selector: 'bs-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  /** Label, damit der Login- bzw. logout-Hinweiß entsprechend
   * angezeigt wird (durch den jeweiligen Zustand)*/
  constructor(private authService: AuthenticationService) {}

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  getLoginLabel() {
    if (this.isLoggedIn()) {
      return ' LOGOUT ';
    } else {
      return ' LOGIN ';
    }

    /** Alternative laut Herrn Putz:
     * getLoginLabel() : string {
    return this.isLoggedIn() ? "LOGOUT":"LOGIN";
    }*/
  }
}
