import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [FormsModule,CommonModule,ButtonModule,CardModule,InputTextModule, PasswordModule,ToastModule], 
  standalone:true,
  providers:[MessageService]
})
export class SignUpComponent {

  constructor(private auth: AuthService, private router: Router,private messageService: MessageService) {}
    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    error = '';

  onSubmit(form: NgForm) {
    if (form.valid && this.password === this.confirmPassword) {
      console.log('Sign-up data:', {
        username: this.username,
        email: this.email,
        password: this.password,
      });
      this.auth.signUp({
      username: this.username,
      password: this.password,
      email: this.email,
      confirmpassword: this.confirmPassword
  }).subscribe({
    next: (response) => {
        const status = response.body.status;

        if (status === 200 || status === 201) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User registered successfully Please SignIn to see Dashboard'
          });
           setTimeout(() => {
                  this.router.navigate(['/landing'], { replaceUrl: true });
                }, 3000);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Registration Failed',
            detail: response.body?.error || 'Unexpected error occurred.'
          });
        }
      },
      error: (err) => {
        // Show error toast using PrimeNG
        this.messageService.add({
          severity: 'error',
          summary: `Error ${err.status || ''}`,
          detail: err.error?.message || 'Something went wrong during registration.'
        });
      }
    });
  }
}
}

