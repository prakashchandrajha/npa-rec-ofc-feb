import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService, UserInfo } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  userInfo: UserInfo | null = null;
  isDivisionUser: boolean = false;
  isNotAdmin: boolean = true;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userInfo = this.authService.getUserInfo();
    this.isDivisionUser = this.userInfo?.userType === 'DIVISION';
    this.isNotAdmin = this.userInfo?.userType !== 'ADMIN';
    this.isAdmin = this.userInfo?.userType === 'ADMIN';
    console.log('Sidebar initialized, userInfo:', this.userInfo);
    console.log('isDivisionUser:', this.isDivisionUser);
    console.log('isNotAdmin:', this.isNotAdmin);
    console.log('isAdmin:', this.isAdmin);
  }

  logout(): void {
    console.log('Logout clicked');
    this.authService.logout();
  }
}
