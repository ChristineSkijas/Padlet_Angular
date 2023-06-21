import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Padlet, User} from '../shared/padlet';
import {Entrie} from '../shared/entrie';
import {PadletService} from '../shared/padlet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PadletFactory} from '../shared/padlet-factory';
import {UserFactory} from '../shared/user-factory';
import {Rating} from '../shared/rating';
import {Comment} from '../shared/comment';
import {firstValueFrom} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../shared/authentication.service';

declare var $: any;

@Component({
  selector: 'bs-padlet-details',
  templateUrl: './padlet-details.component.html',
  styleUrls: ['./padlet-details.component.css'],
})

/** hier wird Anzeige und Bearbeitung von Padlet-Details vrewaltet.
 *  PadletService = Kom mit API, Router für Navigation zwischen Ansichten
 *  AuthenticationService für die Authentifizierung des Benutzers */

export class PadletDetailsComponent implements OnInit {
  padlet: Padlet = PadletFactory.empty();
  padletCopy: Padlet = PadletFactory.empty();
  entries: Entrie[] = [];

  user: User = UserFactory.empty();
  group: FormGroup<any> = new FormGroup({
    name: new FormControl('', [Validators.required]),
    id: new FormControl(0, [Validators.required]),
    user_id: new FormControl(0, [Validators.required]),
  });

  entryGroup: FormGroup<any> = new FormGroup({
    name: new FormControl('', [Validators.required]),
    user_id: new FormControl(0, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    padlet_id: new FormControl(0, [Validators.required]),
    entrie_id: new FormControl(),
  });

  ratingGroup: FormGroup<any> = new FormGroup({
    rating: new FormControl(0, [Validators.min(0), Validators.max(5)]),
    entrie_id: new FormControl(0, [Validators.required]),
    user_id: new FormControl(0, [Validators.required]),
  });

  commentGroup: FormGroup<any> = new FormGroup({
    comment: new FormControl('', []),
    entrie_id: new FormControl(0, [Validators.required]),
    user_id: new FormControl(0, [Validators.required]),
  });

  loggedIn: boolean = false;

  constructor(
    private bs: PadletService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService
  ) {
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.getPadlet(params['id']);
    this.loggedIn = this.auth.isLoggedIn();
  }

  /** einzelnes Padlet laden */
  getPadlet(id: number) {
    this.bs.getSinglePadlet(id).subscribe((p: Padlet) => {
      console.log(p.entries);
      this.padlet = p;
      this.entries = this.padlet.entries;
      this.user = this.padlet.user;
      this.getRatings();
      this.getComments();
      Object.assign(this.padletCopy, this.padlet);
      this.entryGroup.patchValue({
        padlet_id: this.padlet.id,
        user_id: sessionStorage.getItem('userId'),
      });

      /** Anzeigen der geladenen Daten durch FormGroups */
      this.ratingGroup.patchValue({user_id: sessionStorage.getItem('userId')});
      this.commentGroup.patchValue({user_id: sessionStorage.getItem('userId')});
      this.group.patchValue(this.padletCopy);
    });
  }

  getRatings(): void {
    for (let entrie of this.entries) {
      this.bs.getRatingsForEntrie(entrie.id).subscribe((res: Rating[]) => {
        entrie.ratings = res;
      });
    }
  }

  getComments(): void {
    for (let entrie of this.entries) {
      this.bs.getCommentsForEntrie(entrie.id).subscribe((res: Comment[]) => {
        entrie.comments = res;
      });
    }
  }

  getRating(rating: number) {
    return Array(rating);
  }

  /** zum löschen eines Padlets - Pop Up im Browser */
  removePadlet() {
    if (confirm('Möchtest du das Padlet wirklich löschen?')) {
      this.bs
        .remove(this.padlet.id)
        .subscribe((res: any) =>
          this.router.navigate(['../'], {relativeTo: this.route})
        );
    }
  }

  async update(updatedPadlet: Padlet): Promise<void> {
    await firstValueFrom(this.bs.update(updatedPadlet));
    this.getPadlet(updatedPadlet.id);
    this.group.reset();
  }

  openEditModal() {
    $(document).ready(function () {
      $('#padlet-edit').modal('show');
    });
  }

  openAddEntryModal() {
    $(document).ready(function () {
      $('#entry').modal('show');
    });
  }

  async updateEntry(updatedEntry: any): Promise<void> {
    const index = this.padlet.entries.findIndex(e=> e.id === updatedEntry.entrie_id);
    this.padlet.entries[index].title = updatedEntry.title;
    this.padlet.entries[index].content = updatedEntry.content;
    await firstValueFrom(this.bs.updateEntry(this.padlet.entries[index]));
    this.getPadlet(this.padlet.id);
    this.entryGroup.reset();
  }

  openEditEntryModal(entrie: Entrie) {
    this.entryGroup.patchValue({padlet_id: this.padlet.id, entrie_id: entrie.id, title: entrie.title, content: entrie.content});
    $(document).ready(function () {
      $('#entry-edit').modal('show');
    });
  }

  openRatingCommentModal(entrie: Entrie) {
    this.ratingGroup.patchValue({entrie_id: entrie.id});
    this.commentGroup.patchValue({entrie_id: entrie.id});
    $(document).ready(function () {
      $('#rating').modal('show');
    });
  }

  async removeEntry(entrie: Entrie): Promise<void> {
    if (confirm('Möchtest du den Eintrag wirklich löschen?')) {
      await firstValueFrom(this.bs.removeEntrie(entrie.id, this.padlet.id));
      this.update(this.padlet);
    }
  }

  async createEntry(entryGroup: any): Promise<void> {
    await firstValueFrom(
      this.bs.createEntrieForPadlet(entryGroup.padlet_id, entryGroup)
    );
    this.getPadlet(entryGroup.padlet_id);
    this.entryGroup.reset();
  }

  async createRatingComment(
    ratingData: FormGroup<any>,
    commentData: FormGroup<any>
  ): Promise<void> {
    console.log(ratingData.dirty);
    console.log(commentData.dirty);

    if (ratingData.dirty) {
      await firstValueFrom(
        this.bs.addRatingToEntrie(ratingData.value.entrie_id, ratingData.value)
      );
    }
    if (commentData.dirty) {
      console.log('adding comment to entrie');

      await firstValueFrom(
        this.bs.addCommentToEntrie(
          commentData.value.entrie_id,
          commentData.value
        )
      );
    }
    this.getPadlet(this.padlet.id);
    this.ratingGroup.reset();
    this.commentGroup.reset();
  }
}
