import { Location } from './location.service';


export class Author {
  #_id!: string;
  #name!: string;
  #description!: string;
  #location: Location;

  get _id() { return this.#_id };
  get name() { return this.#name };
  get description() { return this.#description };
  get location() { return this.#location };


  set name(name: string) { this.#name = name };
  set description(description: string) { this.#description = description };
  set location(location: Location) { this.#location = location };


  constructor(id: string, name: string, description: string, location: Location) {
    this.#_id = id;
    this.#name = name;
    this.#description = description;
    this.#location = location;
  }
}
