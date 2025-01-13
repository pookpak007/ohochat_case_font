import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TagsComponent } from './components/tags/tags.component';

export const routes: Routes = [
    {
        path:'tags',
        component:TagsComponent
    }
];
