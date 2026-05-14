import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ViewUsers } from './pages/view-users/view-users';
import { CreateUser } from './pages/create-user/create-user';
import { AllNpa } from './pages/all-npa/all-npa';
import { MyDesk } from './pages/my-desk/my-desk';
import { CreateNpa } from './pages/create-npa/create-npa';
import { DraftsNpa } from './pages/drafts-npa/drafts-npa';
import { NpaDetailComponent } from './pages/npa-detail/npa-detail.component';
import { AuthGuard } from './auth.guard';


import { DashboardHome } from './pages/dashboard/dashboard-home/dashboard-home';

export const routes: Routes = [
    {path:'',component: Login},
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard-home', pathMatch: 'full' },
            { path: 'dashboard-home', component: DashboardHome }, // Default dashboard content
            { path: 'view-users', component: ViewUsers },
            { path: 'create-user', component: CreateUser },
            { path: 'create-npa', component: CreateNpa },
            { path: 'drafts-npa', component: DraftsNpa },
            { path: 'npa-detail/:id', component: NpaDetailComponent },
            { path: 'all-npa', component: AllNpa },
            { path: 'my-desk', component: MyDesk }
        ]
    }
];
