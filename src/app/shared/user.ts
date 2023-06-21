import {Padlet} from "./padlet";
export {Padlet} from "./padlet";

export class User {
  constructor(
  public id: number,
  public firstName: string,
  public lastName: string,
  public email: string,
  public password: string,
  public images: string
  ) {
  }
}
