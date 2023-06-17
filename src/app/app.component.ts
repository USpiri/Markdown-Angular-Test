import { Component, inject } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { MARKDOWN_2 } from './md/md';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'md-test-2';
  public content = MARKDOWN_2;
  renderedContent = '';
  markdownService = inject(MarkdownService);

  procesarSintaxisPersonalizada(content: string) {
    const regex = /\[info\]([\s\S]*?)\[\/info\]/g;

    return content.replace(/\n/g, '  \n').replace(regex, (match, content) => {
      const renderedHtml = this.markdownService.parse(content);
      return `<div class="info d-flex flex-column p-3 px-4"><div class='mb-2 header'><i class="fa-solid fa-info me-2"></i>Info</div><div>${renderedHtml}</div></div>`;
    });
  }
}
