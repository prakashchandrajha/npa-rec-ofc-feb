import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NpaFormComponent } from '../../components/parent/npa-form/npa-form.component';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-create-npa',
  imports: [RouterModule, NpaFormComponent, CommonModule, FormsModule],
  templateUrl: './create-npa.html',
  styleUrl: './create-npa.css',
})
export class CreateNpa implements OnInit {
  draftId: number | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get draftId from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['draftId']) {
        this.draftId = parseInt(params['draftId']);
      }
    });
  }
}

