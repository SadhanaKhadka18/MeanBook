import { Author } from './authors.service';

export class Book {
  #_id!: string;
  #title!: string;
  #year!: string;
  #publisherName!: string;
  #authors!: Author[];
  #noOfPages!: number;

  get _id() { return this.#_id };
  get title() { return this.#title };
  get year() { return this.#year };
  get publisherName() { return this.#publisherName };
  get authors() { return this.#authors };
  get noOfPages() { return this.#noOfPages };

  set title(title: string) { this.#title = title };
  set year(year: string) { this.#year = year };
  set publisherName(publisherName: string) { this.#publisherName = publisherName };
  set authors(authors: Author[]) { this.#authors = authors };
  set noOfPages(noOfPages: number) { this.#noOfPages = noOfPages };


  constructor(id: string, title: string, year: string, publisherName: string, noOfPages: number, authors: Author[]) {
    this.#_id = id;
    this.#title = title;
    this.#year = year;
    this.#publisherName = publisherName;
    this.#authors = authors;
    this.#noOfPages = noOfPages;
  }
}
