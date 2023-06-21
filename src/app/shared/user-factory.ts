import {User} from "./user";

export class UserFactory {

  static empty() : User{
    return new User(1,
      "Christine",
      "Muster",
      "test@test.at",
      "secret",
      "imageURL");
  }


  static fromObject(rawUser: any) : User{
    return new User(
      rawUser.id,
      rawUser.firstName,
      rawUser.lastName,
      rawUser.email,
      rawUser.password,
      rawUser.images
    );
  }
}
