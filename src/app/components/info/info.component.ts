import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  template: ` <div class="info-component">HOLA</div> `,
  styles: [
    `
      .info-component {
        background-color: lightblue;
        padding: 10px;
        border: 1px solid blue;
      }
    `,
  ],
})
export class InfoComponent {}
