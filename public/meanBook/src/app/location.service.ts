
export class Location {
  #coordinates!: [number, number]

  get coordinates() { return this.#coordinates; }
  set coordinates(coordinates: [number, number]) { this.#coordinates = coordinates; }

  constructor(coordinates: [number, number] = [0, 0]) {
    this.#coordinates = coordinates;
  }
}
