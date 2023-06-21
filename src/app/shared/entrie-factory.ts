import {Entrie} from "./entrie";

export class EntrieFactory {

  static empty() : Entrie{
    //gibt einen neuen leeren Eintrag aus
    return new Entrie(1, 1, 1, "Neuer Eintrag", "Inhalt neu", [], []);
  }

  //Mapping-Methode, die aus dem RAW-Json ein Eintrag-Objekt erzeugt
  static fromObject(rawEntrie: any) : Entrie{
    return new Entrie(
      rawEntrie.id,
      rawEntrie.user_id,
      rawEntrie.padlet_id,
      rawEntrie.title,
      rawEntrie.content,
      rawEntrie.ratings,
      rawEntrie.comments
    );
  }
}
