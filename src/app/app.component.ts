import { Component } from '@angular/core';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';
import { MarkdownService } from 'ngx-markdown';
import { MARKDOWN_2 } from './md/md';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  /**
   * * Nota
   * El componente editor fue commentado para trabajar más comodamente
   * con el estilo de previsualización.
   */

  public mode: string = 'editor';

  // Configuración del editor
  public options: MdEditorOption = {
    showPreviewPanel: false,
    enablePreviewContentClick: false,
    resizable: false,
    customRender: {
      image: function (href: string, title: string, text: string) {
        let out = `<img style="max-width: 100%; border: 20px solid red;" src="${href}" alt="${text}"`;
        if (title) {
          out += ` title="${title}"`;
        }
        out += (<any>this).xhtml ? '/>' : '>';
        return out;
      },
    },
    /**
     * Otras opciones
     */
    // fontAwesomeVersion: '6',
    // usingFontAwesome5: true,
    // customIcons: {
    //   Bold: { fontClass: 'fa-solid fa-bold' },
    //   Italic: { fontClass: 'fa-solid fa-italic' },
    //   Heading: { fontClass: 'fa-solid fa-heading' },
    //   Reference: { fontClass: 'fa-solid fa-quote-left' },
    //   Link: { fontClass: 'fa-solid fa-link' },
    //   Image: { fontClass: 'fa-solid fa-image' },
    //   UnorderedList: { fontClass: 'fa-solid fa-list-ul' },
    //   OrderedList: { fontClass: 'fa-solid fa-list-ol' },
    //   CodeBlock: { fontClass: 'fa-solid fa-file-code' },
    //   ShowPreview: { fontClass: 'fa-solid fa-eye' },
    //   HidePreview: { fontClass: 'fa-solid fa-eye-slash' },
    //   FullScreen: { fontClass: 'fa-solid fa-maximize' },
    //   CheckBox_UnChecked: { fontClass: 'fa-regular fa-square' },
    //   CheckBox_Checked: { fontClass: 'fa-solid fa-check-square' }
    // },
    markedjsOpt: {
      sanitize: false,
    },
  };

  title = 'md-test-2';
  public content = MARKDOWN_2;
  renderedContent = '';

  constructor(private markdownService: MarkdownService) {
    this.doUpload = this.doUpload.bind(this);
  }

  /**
   * Filtra y aplica un renderizado custom para componentes custom Ej: [info][/info]
   * al que lo renderiza como un div con la clase info. Esta clase tiene su estilo
   * personalizado en el scss de este componente => ./app.component.scss
   */
  procesarSintaxisPersonalizada(content: string) {
    // Regla regex para separar el contenido de las 'tags' [info][/info]
    const regex = /\[info\]([\s\S]*?)\[\/info\]/g;
    // Reemplazo del contenido
    return content.replace(/\n/g, '  \n').replace(regex, (match, content) => {
      /**
       * El markdown service es utilizado para tomar el contenido que está dentro de
       * las tags y tratarlo como si fuera un markdown, es decir, permitir el uso de
       * escritura propia de markdown dentro del mismo componente. Ej: Usar # para
       * titulos
       */
      const renderedHtml = this.markdownService.parse(content);
      return `<div class="info d-flex flex-column p-3 px-4"><div class='mb-2 header'><i class="fa-solid fa-info me-2"></i>Info</div><div>${renderedHtml}</div></div>`;
    });
  }

  /**
   * Se ejecuta al copiar y pegar o arrastrar una imagen al editor para guardarla, por ejemplo en aws.
   */
  doUpload(files: Array<File>): Promise<Array<UploadResult>> {
    return new Promise((resolve) => {
      console.log('HOLA');

      setTimeout(() => {
        const result: Array<UploadResult> = [];
        for (const file of files) {
          result.push({
            name: file.name,
            url: `https://avatars3.githubusercontent.com/${file.name}`,
            isImg: file.type.indexOf('image') !== -1,
          });
        }
        resolve(result);
      }, 3000);
    });
  }

  /**
   * Alterna el modo de vista
   */
  // togglePreviewPanel() {
  //   this.options.showPreviewPanel = !this.options.showPreviewPanel;
  //   this.options = Object.assign({}, this.options);
  // }

  /**
   * Alterna el modo
   */
  // changeMode() {
  //   if (this.mode === 'editor') {
  //     this.mode = 'preview';
  //   } else {
  //     this.mode = 'editor';
  //   }
  // }

  /**
   * Alterna si se reescala o no
   */
  // toggleResizeAble() {
  //   this.options.resizable = !this.options.resizable;
  //   this.options = Object.assign({}, this.options);
  // }

  /**
   * Botón custom, agrega la imagen como base64 al markdown
   * Buscar Types
   */
  uploadImg(evt: any) {
    if (!evt) return;
    const file = evt.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.content += `![](${reader.result})`;
      },
      false
    );

    if (file) reader.readAsDataURL(file);
  }

  /**
   * Al cargar el editor (Como si fuera el constructor del editor)
   * Buscar Type
   */
  onEditorLoaded(editor: any) {
    console.log(`ACE Editor Ins: `, editor);

    editor.setShowPrintMargin(false);

    // editor.setOption('showLineNumbers', false);

    // setTimeout(() => {
    //   editor.setOption('showLineNumbers', true);
    // }, 2000);
  }

  /**
   * Antes de renderizar (Como si fuera el OnInit del editor)
   * Buscar Type
   */
  preRender(mdContent: any) {
    console.log(`preRender fired`);
    // return new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(mdContent);
    //   }, 4000);
    // })
    return mdContent;
  }

  /**
   * Después de renderizar (Como si fuera el AfterViewInit del editor)
   * Buscar Type
   */
  postRender(html: string) {
    console.log(`postRender fired`);
    // return '<h1>Test</h1>';
    return html;
  }

  /**
   * Al cambiar y renderizar (Como si fuera el OnChanges del editor)
   * Buscar Type
   */
  onPreviewDomChanged(dom: HTMLElement) {
    console.log(`onPreviewDomChanged fired`);
    // console.log(dom);
    // console.log(dom.innerHTML)
  }

  handleKeyPress(event: Event) {
    const element = event.target as HTMLElement;
    const content = element.textContent;
    console.log('Contenido:', element.innerHTML);
    this.content = element.innerHTML;
  }
}
