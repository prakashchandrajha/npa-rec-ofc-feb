import { Component } from '@angular/core';
import { BasicDetailsOfTheBorrower01Component } from '../../child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component';

@Component({
  selector: 'app-npa-form',
  imports: [BasicDetailsOfTheBorrower01Component],
  templateUrl: './npa-form.component.html',
  styleUrl: './npa-form.component.css'
})
export class NpaFormComponent {

}
