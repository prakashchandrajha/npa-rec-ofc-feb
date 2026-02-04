import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NpaFormComponent } from '../../components/parent/npa-form/npa-form.component';



@Component({
  selector: 'app-create-npa',
  imports: [RouterModule, NpaFormComponent],
  templateUrl: './create-npa.html',
  styleUrl: './create-npa.css',
})
export class CreateNpa {
  
}
