import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { ViewUsers } from './pages/view-users/view-users';
import { CreateUser } from './pages/create-user/create-user';
import { AllNpa } from './pages/all-npa/all-npa';
import { MyDesk } from './pages/my-desk/my-desk';
import { CreateNpa } from './pages/create-npa/create-npa';
import { AuthGuard } from './auth.guard';


export const routes: Routes = [
    {path:'',component: Login},
    {
        path: 'dashboard', 
        component: Dashboard, 
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/dashboard/dashboard-content', pathMatch: 'full' },
            { path: 'dashboard-content', component: ViewUsers }, // Default dashboard content
            { path: 'view-users', component: ViewUsers },
            { path: 'create-user', component: CreateUser },
            { path: 'create-npa', component: CreateNpa },
            { path: 'all-npa', component: AllNpa },
            { path: 'my-desk', component: MyDesk }
        ]
    }
];
