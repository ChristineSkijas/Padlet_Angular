import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

//npm install --save-dev jwt-decode

interface Token {
  exp: number;
  user: {
    id: string;
  };
}
@Injectable()
export class AuthenticationService {
  private api: string = "http://padletlist.s2010456031.student.kwmhgb.at/api/auth";
  constructor(private http: HttpClient) {}

  /** die loginmethode greift auf den AutenticationService zu, schickt benutzername
   *  und passwort und bekommt hoffenltich etwas brauchbares zurück oder auch nicht*/
  login(email: string, password: string) {
    return this.http.post(`${this.api}/login`, {
      email: email,
      password: password,
    });
  }

  public getCurrentUserId() {
    return Number.parseInt(<string>sessionStorage.getItem('userId'));
  }

  //nimmt den Token und speichert diesen in der Session-Storage des Browsers
  public setSessionStorage(token: string) {
    console.log('Saving token');
    console.log(jwt_decode(token));
    //Token muss "decodiert" werden, damit er zerlegt werden & und auf Payload zugreifen kann
    const decodedToken = jwt_decode(token) as Token;
    console.log(decodedToken);
    console.log(decodedToken.user.id);
    //dann wird der Token in der SessionStorage der aktuellen Domäne gespeichert
    sessionStorage.setItem('token', token);
    // und es ird auch die UserID gepseichert, um schnell auf sie zugreifen zu können
    sessionStorage.setItem('userId', decodedToken.user.id);
  }

  //LogOut-Methode wird am Werver aufgerufen
  logout() {
    this.http.post(`${this.api}/logout`, {});
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    console.log('logged out');
  }

  /** hier wird gefragt, ob man eingeloggt ist. Wenn nein, wird das Formular gezeigt.
   * Ist man eingelogg, dann soll der LogOut-Button angezeigt werden*/
  public isLoggedIn() {
    if (sessionStorage.getItem('token')) {
      let token: string = <string>sessionStorage.getItem('token');
      // console.log(jwt_decode(token));
      const decodedToken = jwt_decode(token) as Token;
      let expirationDate: Date = new Date(0);
      /** vom 1.1.1970 werden dann alle bisherigen Sekunden hinzugerechnet und dadurch
       * wird das expirationDate ausgerechnet (also wann läuft der Token ab). das wird dann mit
       * dem aktuellen Datum verglichen. Ist das aktuelle Datum kleiner, bleibt der Token gültig */
      expirationDate.setUTCSeconds(decodedToken.exp);
      if (expirationDate < new Date()) {
        console.log('token expired');
        sessionStorage.removeItem('token');
        return false;
      }
      return true;
    }
    //ist kein Token da, dann ist der return false
    else {
      return false;
    }
  }
  /** Gegengleich braucht man auch eine Methode, die das gegenteil
   * von loggedIn angibt (wenn man ausgeloggt ist)*/
  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
