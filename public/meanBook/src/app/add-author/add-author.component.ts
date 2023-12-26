import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Author } from '../authors.service';
import { AuthorDataService } from '../author-data.service';
import { Location } from '../location.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})

export class AddAuthorComponent implements OnInit {
  authorName!: string;
  authorDescription!: string;
  authorLongitude!: string;
  authorLatitude!: string;
  addAuthorData = {
    name: "",
    description: "",
    latitude: 0,
    longitude: 0

  }
  constructor(private _authtorDataService: AuthorDataService, private _route: ActivatedRoute, private _router: Router) { }
  
  ngOnInit(): void {
    this._loadConstantsFromEnvironments();
  }
  _loadConstantsFromEnvironments() {
    this.authorName = environment.AuthorName;
    this.authorDescription = environment.AuthorDescription;
    this.authorLongitude = environment.AuthorLocationLongitude;
    this.authorLatitude = environment.AuthorLocationLatitude;
  }
  submitAddAuthorForm(): void {
    if (this.addAuthorData) {
      const authorFromForm = this.addAuthorData;
      const newAuthor: Author = new Author("", authorFromForm.name, authorFromForm.description, new Location([authorFromForm.longitude, authorFromForm.latitude]));
      const bookId = this._route.snapshot.params["bookId"]
      this._authtorDataService.addAuthor(bookId, newAuthor).subscribe({
        next: () => {
          this._router.navigate(['/book/' + bookId]);
        },
        error: (err) => {
          console.log("error while updating Author");

        }
      }
      )


    }


  }
}
