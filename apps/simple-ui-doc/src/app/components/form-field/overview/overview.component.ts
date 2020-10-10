import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'doc-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])]],
      password: [null, [Validators.required]]
    });
  }

  onSubmit() {
    console.log(this.validateForm.value);
  }
}
