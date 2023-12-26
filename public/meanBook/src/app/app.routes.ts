import { Routes } from "@angular/router";

import { AddAuthorComponent } from "./add-author/add-author.component";
import { AddBookComponent } from "./add-book/add-book.component";
import { AuthorComponent } from "./author/author.component";
import { BookComponent } from "./book/book.component";
import { BooksComponent } from "./books/books.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { UpdateAuthorComponent } from "./update-author/update-author.component";
import { UpdateBookComponent } from "./update-book/update-book.component";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent

    }, {
        path: "books",
        component: BooksComponent
    },
    {
        path: "book/:bookId",
        component: BookComponent
    },
    {
        path: "book/:bookId/author/:authorId",
        component: AuthorComponent
    },
    {
        path: "book/:bookId/AddAuthor",
        component: AddAuthorComponent
    },
    {
        path: "book/:bookId/UpdateAuthor/:authorId",
        component: UpdateAuthorComponent
    }, {
        path: "addBook",
        component: AddBookComponent
    }, {
        path: "updateBook/:bookId",
        component: UpdateBookComponent
    }, {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "profile",
        component: ProfileComponent
    }
]