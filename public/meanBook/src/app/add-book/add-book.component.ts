import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { BooksDataService } from '../books-data.service';
import { Book } from '../book.service';
import { Author } from '../authors.service';
import { Location } from '../location.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})

export class AddBookComponent implements OnInit {

  addBookForm!: FormGroup;
  title!: string;
  noOfPages!: string;
  year!: string;
  publisherName!: string;
  authorName!: string;
  authorDescription!: string;
  authorLongitude!: string;
  authorLatitude!: string;

  constructor(private _formBuilder: FormBuilder, private _bookDataService: BooksDataService, private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this.initializeAddBookForm();
    this._loadConstantsFromEnvironmwnts();
  }

  _loadConstantsFromEnvironmwnts() {
    this.title = environment.BookTitle;
    this.noOfPages = environment.NoofPages;
    this.year = environment.BookPublishedYear;
    this.publisherName = environment.BookPublisherName;
    this.authorName = environment.AuthorName;
    this.authorDescription = environment.AuthorDescription;
    this.authorLongitude = environment.AuthorLocationLongitude;
    this.authorLatitude = environment.AuthorLocationLatitude;
  }
  initializeAddBookForm(): void {
    this.addBookForm = this._formBuilder.group({
      title: [''],
      noOfPages: [''],
      year: [''],
      publisherName: [''],
      authorName: [''],
      authorDescription: [''],
      authorLongitude: [''],
      authorLatitude: ['']
    })
  }

  onAddBookFormSubmit(): void {
    const bookID = this._route.snapshot.params["bookId"];
    if (this.addBookForm) {
      const bookFromForm = this.addBookForm.value;
      const newBook = new Book("", bookFromForm.title, bookFromForm.year, bookFromForm.publisherName, bookFromForm.noOfPages, [new Author("", bookFromForm.authorName, bookFromForm.authorDescription, new Location([bookFromForm.authorLongitude, bookFromForm.authorLatitude]))]);
      this._bookDataService.addBook(newBook).subscribe({
        next: (addedBook) => {
          this._router.navigate(['/book/' + addedBook._id])
        },
        error: () => { }
      })

    }
  }
}
