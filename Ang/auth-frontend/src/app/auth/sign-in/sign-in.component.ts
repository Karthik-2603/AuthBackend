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
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  imports: [FormsModule,CommonModule,InputTextModule, PasswordModule, ButtonModule,CardModule,ToastModule,RouterModule,], 
  standalone: true
})
export class SignInComponent {

  constructor(private auth: AuthService, private router: Router,private messageService: MessageService) {}

  username = '';
  password = '';
  error = '';

      onSubmit(form: NgForm) {
      if (form.valid) {
        this.auth.signIn({ username: this.username, password: this.password }).subscribe({
          next: (response) => {
            const status = response.body.status;

            if (status === 200 || status === 201) {
              localStorage.setItem('auth_token', response.body.data.token);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'User logged in successfully'
              });
              localStorage.setItem('username', this.username);
              setTimeout(() => {
                  this.router.navigate(['/dashboard'], { replaceUrl: true });
                }, 1000);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Login Failed',
                detail: response.body?.error || 'Unexpected error occurred.'
              });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: `Error ${err.status}`,
              detail: err.error?.message || 'Invalid username or password.'
            });
          }
        });
      }
  }
}