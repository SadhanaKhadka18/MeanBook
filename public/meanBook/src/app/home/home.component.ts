import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  welcomeMessage!: string;
  ngOnInit(): void {
    this.welcomeMessage = environment.welcomeMessage;
  }


}
