import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Padlet, User } from '../shared/padlet';
import { PadletService } from '../shared/padlet.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '../shared/authentication.service';

declare var $: any;

@Component({
  selector: 'bs-padlet-list',
  templateUrl: './padlet-list.component.html',
  styleUrls: ['./padlet-list.component.css'],
})

export class PadletListComponent implements OnInit {
  padlets: Padlet[] = [];
  group: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    user_id: new FormControl(0, [Validators.required]),
    is_public: new FormControl(true, [Validators.required]),
  });
  loggedIn: boolean = false;

  /** Verknüpfung mit PadletService.serve.ts #1*/
  constructor(private bs: PadletService, private auth: AuthenticationService) {}

  ngOnInit() {
    this.getAllPadlets();
    this.loggedIn = this.auth.isLoggedIn();
  }

  getAllPadlets() {
    this.bs.getAllPadlets().subscribe((res) => (this.padlets = res));
  }

  async create(padlet: Padlet): Promise<void> {
    //Neues Padlet erstellen
    await firstValueFrom(this.bs.create({...padlet, user_id:+(sessionStorage.getItem("userId")??"")}));
    this.getAllPadlets();
    this.group.reset();
  }
  showModal(): void {
    $('.small.modal').modal('show');
  }
}
