export class User {

  #name: string;
  #username: string;
  #password: string;

  get name() { return this.#name; }
  get username() { return this.#username; }
  get password() { return this.#password; }

  set name(name: string) { this.#name = name; }
  set username(username: string) { this.#username = username; }
  set password(password: string) { this.#password = password; }

  constructor(name: string = "", username: string, password: string) {
    this.#name = name,
      this.#username = username,
      this.#password = password
  }
}
