import { Component, OnInit, Input } from '@angular/core';
import { Padlet } from '../shared/padlet';

@Component({
  selector: 'a.bs-padlet-list-item',
  templateUrl: './padlet-list-item.component.html',
  styles: [],
})

export class PadletListItemComponent implements OnInit {
  /** der Input-Dekorator gibt von der Padletliste-Komponente ein Padlet-Element raus */
  @Input() padlet: Padlet | undefined;

  constructor() {}

  ngOnInit() {}
}
