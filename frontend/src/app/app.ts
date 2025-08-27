import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParceiroFormComponent } from './features/parceiro-form/parceiro-form.component';


@Component({
selector: 'app-root',
standalone: true,
imports: [CommonModule, ParceiroFormComponent],
templateUrl: './app.html',
styleUrls: ['./app.css']
})
export class AppComponent {}