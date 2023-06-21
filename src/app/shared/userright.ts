import {User} from "./user";
export {User} from "./user";
import {Padlet} from "./padlet";
export {Padlet} from "./padlet";

export class Userright {
  constructor(
    public user_id:number,
    public padlet_id: number,
    public read: boolean,
    public edit: boolean,
    public del: boolean
  ) {}
}
