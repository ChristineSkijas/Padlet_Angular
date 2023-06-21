import {Padlet, User} from "./padlet";

export class PadletFactory {

  static empty() : Padlet{
    //gibt ein neues leeres Padlet aus
    return new Padlet(1,'Padletname',1, true, [],
      new User(1, "Maxime", "Musterfrau",
        "muster@test.at", "secret", "image"));
  }

  //Mapping-Methode, die aus dem RAW-Json ein Padlet-Objekt erzeugt
  static fromObject(rawPadlet: any) : Padlet{
    return new Padlet(
      rawPadlet.id,
      rawPadlet.name,
      rawPadlet.user_id,
      rawPadlet.is_public,
      rawPadlet.entries,
      rawPadlet.user
    );

  }
}
