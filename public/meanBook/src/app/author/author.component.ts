import { Component, OnInit } from '@angular/core';
import { Author } from '../authors.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { AuthorDataService } from '../author-data.service';
import { Location } from '../location.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  author: Author;
  bookId!: string;
  constructor(private _router: Router, private _route: ActivatedRoute, private _authorDataService: AuthorDataService,
    private _authenticationService: AuthenticationService) {
    this.author = new Author("", "", "", new Location([0, 0]));
  }
  ngOnInit(): void {
    this._loadAuthor();
  }
  _loadAuthor(): void {
    this.bookId = this._route.snapshot.params["bookId"];
    const authorId = this._route.snapshot.params["authorId"];
    this._authorDataService.getAuthor(this.bookId, authorId).subscribe({
      next: (author) => {
        // console.log(author);
        this.author = author;
      },
      error: () => {
        console.log("error in getting author");

      }
    })
  }
  onDeleteAuthor(): void {
    const authorId = this._route.snapshot.params['authorId'];
    this._authorDataService.deleteAuthor(this.bookId, authorId).subscribe({
      next: (deletedAuthor) => {
        this._router.navigate(['/book/' + this.bookId])

      },
      error: () => {
        console.log("error in deleting Author");
      }
    }
    )
  }

  isLoggedIn(): Boolean {
    return this._authenticationService.getLoggedIn();
  }

  backToBookPage(): void {
    this._router.navigate(['/book/' + this.bookId])
  }

}
