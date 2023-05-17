import { Component, OnInit } from '@angular/core';
import { MdEditorOption, UploadResult } from 'ngx-markdown-editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public mode: string = 'editor';
  public options: MdEditorOption = {
    showPreviewPanel: false,
    enablePreviewContentClick: false,
    resizable: false,
    /**
     * Para el renderizado del editor (No el de la derecha)
     */
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
      sanitize: true,
    },
  };

  title = 'md-test-2';
  public content = '';

  constructor() {
    this.doUpload = this.doUpload.bind(this);
  }

  ngOnInit() {
    /**
     * Markdown de ejemplo
     */
    const contentArr = ['# Hello, Markdown Editor!'];
    contentArr.push('```javascript ');
    contentArr.push('function Test() {');
    contentArr.push('	console.log("Test");');
    contentArr.push('}');
    contentArr.push('```');
    contentArr.push(' Name | Type');
    contentArr.push(' ---- | ----');
    contentArr.push(' A | Test');
    contentArr.push(
      '![](http://lon-yang.github.io/markdown-editor/favicon.ico)'
    );
    contentArr.push('');
    contentArr.push('- [ ] Taks A');
    contentArr.push('- [x] Taks B');
    contentArr.push('- test');
    contentArr.push('');
    contentArr.push('[Link](https://www.google.com)');
    contentArr.push('');
    this.content = contentArr.join('\r\n');
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
}
