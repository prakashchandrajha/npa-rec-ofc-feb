import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content-view-page',
  imports: [RouterModule, RouterOutlet],
  templateUrl: './content-view-page.html',
  styleUrl: './content-view-page.css'
})
export class ContentViewPage {

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/']);
  }

}
