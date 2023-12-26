import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Book } from '../book.service';
import { BooksDataService } from '../books-data.service';
import { AuthenticationService } from '../authentication.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})

export class BooksComponent implements OnInit {
  offset = 0;
  count = 5;
  books: Book[] = [];
  searchBookForm!: FormGroup;
  searchMessage!: string;
  latitudeTosearch!: string;
  longitudeTosearch!: string;
  maximumDistanceInKmTosearch!: string;
  constructor(private _bookDataService: BooksDataService, private _authenticationService: AuthenticationService, private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this._loadBooks();
    this._getSearchForm();
    this._loadConstantsfromEnvironement();

  }
  _loadConstantsfromEnvironement(): void {
    this.searchMessage = environment.searchMessage;
    this.latitudeTosearch = environment.LatitudetoSearch;
    this.longitudeTosearch = environment.LatitudetoSearch;
    this.maximumDistanceInKmTosearch = environment.MaximumDistanceInKm;
  }
  _getSearchForm(): void {
    this.searchBookForm = this._formBuilder.group({
      latitude: '',
      longitude: '',
      maxDistance: ''
    })
  }

  _loadBooks(): void {
    this._bookDataService.getBooks(this.offset).subscribe({
      next: (books: Book[]) => {
        this.books = books;
      },
      error: (err) => {
        console.log("error in getting Books");
      }
    });
  }

  previousPage(): void {
    if (this.offset - this.count >= 0) {
      this.offset -= this.count;
      this._loadBooks();
    }

  }
  nextPage(): void {

    if (this.books.length === this.count) {
      this.offset += this.count;
      this._loadBooks();
    }

  }
  isPreviousDisabled(): Boolean {
    return this.offset === 0;
  }
  isNextDisabled(): Boolean {
    return this.books.length < this.count;
  }

  sortBooks() {
    this.books.sort((book1, book2) => book1.title.localeCompare(book2.title));
  }
  isLoggedIn(): Boolean {
    return this._authenticationService.getLoggedIn();
  }

  onsearchFormSubmit(): void {
    const searchFormFromForm = this.searchBookForm.value;
    if (this.searchBookForm) {
      const latInput: number = searchFormFromForm.latitude;
      const longInput: number = searchFormFromForm.longitude;
      const maxDistInput: number = searchFormFromForm.maxDistance;

      this._bookDataService.getNearestBooks(this.offset, latInput, longInput, maxDistInput).subscribe({
        next: (books) => this.books = books,
        error: (err) => {
          console.log("error in getting Books");
        }
      })

    }

  }
}
