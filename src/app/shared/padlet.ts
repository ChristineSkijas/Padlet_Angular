import { User } from "./user";
export {User} from "./user";
import {Entrie} from "./entrie";

export class Padlet {
  constructor(
    public id: number,
    public name: string,
    public user_id: number,
    public is_public: boolean,
    public entries: Entrie[],
    public user: User
  ) {}
}
