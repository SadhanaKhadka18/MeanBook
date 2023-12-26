import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Author } from './authors.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthorDataService {
  baseUrl = environment.base_url;
  constructor(private _http: HttpClient) { }

  private _getAuthorjson(newAuthor: Author) {
    return {
      "authors": [{
        "name": newAuthor.name,
        "description": newAuthor.description,
        "location": { coordinates: [newAuthor.location.coordinates[0], newAuthor.location.coordinates[1]] }
      }]
    }
  }
  private _getUpdatedAuthorjson(newAuthor: Author) {
    return {
      "name": newAuthor.name,
      "description": newAuthor.description,
      "location": { coordinates: [newAuthor.location.coordinates[0], newAuthor.location.coordinates[1]] }
    }
  }
  public getAuthor(bookId: string, authorId: string): Observable<Author> {
    const url = this.baseUrl + "books/" + bookId + "/authors/" + authorId;
    return this._http.get<Author>(url);
  }
  public addAuthor(bookId: string, newAuthor: Author): Observable<Author> {
    const url = this.baseUrl + "books/" + bookId + "/authors/";
    const authorToAdd = this._getAuthorjson(newAuthor);
    return this._http.post<Author>(url, authorToAdd);

  }
  public deleteAuthor(bookId: string, authorId: string): Observable<Author> {
    const url = this.baseUrl + "books/" + bookId + "/authors/" + authorId;
    return this._http.delete<Author>(url);
  }
  public updateAuthor(bookId: string, authorId: string, updatedAuthor: Author): Observable<Author> {
    const authorToUpdate = this._getUpdatedAuthorjson(updatedAuthor);
    const url = this.baseUrl + "books/" + bookId + "/authors/" + authorId;
    return this._http.put<Author>(url, authorToUpdate);
  }
}
