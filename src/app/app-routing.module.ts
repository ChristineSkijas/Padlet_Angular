import {RouterModule, Routes} from "@angular/router";
import {PadletListComponent} from "./padlet-list/padlet-list.component";
import {PadletDetailsComponent} from "./padlet-details/padlet-details.component";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./login/login.component";

const routes: Routes = [
  { path: '', redirectTo: 'padlets', pathMatch: 'full'},
  { path: 'padlets', component: PadletListComponent},
  { path: 'padlets/:id', component: PadletDetailsComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
