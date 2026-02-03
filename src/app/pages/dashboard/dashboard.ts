import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { ContentViewPage } from '../../components/content-view-page/content-view-page';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, Sidebar, ContentViewPage],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
