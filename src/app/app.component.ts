import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  projectstatus: string[] = ['Stable', 'Critical', 'Finished'];
  statusDefault: string = 'Stable';
  form: FormGroup;
  formSubmitted: boolean = false;
  formData: { [key: string]: unknown } = {};
  projectForbiddenNames: string[] = ['Test'];
  usedEmailList: string[] = ['test@test.com'];

  constructor() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, this.forbiddenNames]),
      email: new FormControl(
        null,
        [Validators.required, Validators.email],
        <AsyncValidatorFn>this.usedEmails
      ),
      status: new FormControl(this.statusDefault, Validators.required),
    });
  }

  ngOnInit() {}

  onSubmit() {
    console.log(this.form.value);
    this.formSubmitted = true;
    this.formData = this.form.value;
    this.form.reset({
      status: this.statusDefault,
    });
  }

  forbiddenNames = (
    control: FormControl
  ): { [key: string]: boolean } | null => {
    if (this.projectForbiddenNames.includes(control.value)) {
      return { invalidName: true };
    }
    return null;
  };

  getFormControl = (code: string): FormControl => {
    return <FormControl>this.form.get(code);
  };

  getFormControlErrors = (code: string, errorCode: string): boolean | null => {
    const errors = <ValidationErrors>(<FormControl>this.form.get(code)).errors;
    if (errors) {
      return errors[errorCode];
    }
    return null;
  };

  usedEmails = async (control: FormControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.usedEmailList.includes(control.value)) {
          resolve({ emailIsUsed: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });
  };
}
