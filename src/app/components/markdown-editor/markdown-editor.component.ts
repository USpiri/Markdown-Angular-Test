import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MarkdownEditorComponent),
  multi: true,
};

@Component({
  selector: 'app-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class MarkdownEditorComponent implements ControlValueAccessor {
  changes: string[] = [];
  historyIndex: number = -1;
  firstChange = true;
  isUndoing = false;
  isBulletsActive = false;

  @Input() value: string = '';
  @Input() uploadImage: (file: File) => Promise<string> = async (
    file: File
  ) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Error al leer el archivo.'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo.'));
      };

      reader.readAsDataURL(file);
    });
  };

  @ViewChild('editor') editor!: ElementRef;

  onChange = (value: any) => {};
  onTouch = () => {};

  writeValue(value: any) {
    this.value = value;

    const isNewValueDifferent =
      this.historyIndex === -1 ||
      this.value !== this.changes[this.historyIndex];

    if (isNewValueDifferent && this.value !== null) {
      this.historyIndex++;
      this.changes.splice(this.historyIndex);
      this.changes.push(this.value ?? '');
    }

    this.onTouch();
  }

  registerOnChange(onChange: (value: any) => void) {
    this.onChange = (value: string) => {
      if (!this.isUndoing) {
        this.value = value;
        this.addChanges();
      }

      console.log(this.changes);
      return onChange(value); // Llamada recursiva infinita
    };
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouch = onTouched;
  }

  getInputElementValue(event: Event): string {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    return target.value;
  }

  boldText() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    this.checkUpdate();

    if (start !== null && end !== null) {
      const selectedText = textarea.value.substring(start, end);
      const newText =
        textarea.value.slice(0, start) +
        `**${selectedText}**` +
        textarea.value.slice(end);

      this.value = newText;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }
    this.onChange(this.value);
    this.onTouch();
  }

  italicText() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    this.checkUpdate();

    if (start !== null && end !== null) {
      const selectedText = textarea.value.substring(start, end);
      const newText =
        textarea.value.slice(0, start) +
        `*${selectedText}*` +
        textarea.value.slice(end);

      this.value = newText;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, end + 1);
      }, 0);
    }
    this.onChange(this.value);
    this.onTouch();
  }

  heading(headingLevel: number) {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const currentCursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n');

    if (currentCursorPosition !== null) {
      const currentLineIndex =
        textarea.value.substring(0, currentCursorPosition).split('\n').length -
        1;
      const currentLine = lines[currentLineIndex];
      lines[currentLineIndex] = `${this.headingLevel(
        headingLevel
      )} ${currentLine}`;

      this.value = lines.join('\n');
      setTimeout(() => {
        textarea.focus();
        let newCursorPosition = currentCursorPosition + 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);

      this.onChange(this.value);
      this.onTouch();
    }
  }

  headingLevel(level: number): string {
    return '#'.repeat(level);
  }

  blockquote() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const currentCursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n');

    if (currentCursorPosition !== null) {
      const currentLineIndex =
        textarea.value.substring(0, currentCursorPosition).split('\n').length -
        1;
      const currentLine = lines[currentLineIndex];
      lines[currentLineIndex] = `> ${currentLine}`;

      this.value = lines.join('\n');
      setTimeout(() => {
        textarea.focus();
        let newCursorPosition = currentCursorPosition + 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);

      this.onChange(this.value);
      this.onTouch();
    }
  }

  bulletList() {
    this.isBulletsActive = true;
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const currentCursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n');

    if (currentCursorPosition !== null) {
      const currentLineIndex =
        textarea.value.substring(0, currentCursorPosition).split('\n').length -
        1;
      const currentLine = lines[currentLineIndex];
      lines[currentLineIndex] = `- ${currentLine}`;

      this.value = lines.join('\n');
      setTimeout(() => {
        textarea.focus();
        let newCursorPosition = currentCursorPosition + 2;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);

      this.onChange(this.value);
      this.onTouch();
    }
  }

  codeBlock() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== end) {
      const selectedText = textarea.value.substring(start, end);
      const codeBlock = '```';
      const content =
        start === end
          ? '```\n```'
          : `\n${codeBlock}\n${selectedText}\n${codeBlock}\n`;
      const newText =
        textarea.value.slice(0, start - 1) +
        `\n${codeBlock}\n${selectedText}\n${codeBlock}\n` +
        textarea.value.slice(end);

      this.value = newText;
      const newCursorPosition = end + codeBlock.length + 1;

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    } else {
      const codeBlock = '```\n```';
      const currentCursorPosition = textarea.value.length;
      this.value = textarea.value + `${codeBlock}`;
      const newCursorPosition = currentCursorPosition + codeBlock.length - 4;

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }

    this.onChange(this.value);
    this.onTouch();
  }

  codeLine() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    this.checkUpdate();

    if (start !== null && end !== null) {
      const selectedText = textarea.value.substring(start, end);
      const newText =
        textarea.value.slice(0, start) +
        `\`${selectedText}\`` +
        textarea.value.slice(end);

      this.value = newText;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 2, end + 2);
      }, 0);
    }
    this.onChange(this.value);
    this.onTouch();
  }

  link() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start !== null && end !== null) {
      const selectedText = textarea.value.substring(start, end);
      const linkText = `[${selectedText}](url)`;
      const newText =
        textarea.value.slice(0, start) +
        `${linkText}` +
        textarea.value.slice(end);

      this.value = newText;
      const newCursorPosition =
        start === end ? end + linkText.length - 6 : start + linkText.length - 1;

      setTimeout(() => {
        textarea.focus();
        if (start === end) {
          textarea.setSelectionRange(newCursorPosition, newCursorPosition);
        } else {
          textarea.setSelectionRange(newCursorPosition - 3, newCursorPosition);
        }
      }, 0);
    }

    this.onChange(this.value);
    this.onTouch();
  }

  horizontalRule() {
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const currentCursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n');
    const hrLine = '___';
    const currentLineIndex =
      textarea.value.substring(0, currentCursorPosition).split('\n').length - 1;
    lines.splice(currentLineIndex + 1, 0, hrLine);

    this.value = lines.join('\n');
    const newCursorPosition = currentCursorPosition + hrLine.length + 1;

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);

    this.onChange(this.value);
    this.onTouch();
  }

  async handleImageUpload(file: File) {
    const imageURL = await this.uploadImage(file);
    const textarea: HTMLTextAreaElement = this.editor.nativeElement;
    const currentCursorPosition = textarea.selectionStart;
    const lines = textarea.value.split('\n');
    const scrollTop = textarea.scrollTop;

    lines.splice(currentCursorPosition, 0, `![description](${imageURL})`);

    const newValue = lines.join('\n');

    this.value = newValue;
    setTimeout(() => {
      textarea.focus();
      const updatedCursorPosition = currentCursorPosition + 3;
      const start = textarea.value.indexOf(
        'description',
        updatedCursorPosition
      );
      const end = start + 11;
      textarea.scrollTop = scrollTop;
      textarea.setSelectionRange(start, end);
    }, 0);
    this.onChange(this.value);
    this.onTouch();
  }

  handleImageInsert() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', (event: any) =>
      this.handleImageUpload(event.target.files[0])
    );
    fileInput.click();
  }

  addChanges() {
    this.historyIndex++;
    if (this.historyIndex < this.changes.length) {
      this.changes.splice(this.historyIndex);
    }
    this.changes.push(this.value);
  }

  undoChanges() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.changes.splice(this.historyIndex + 1);
      this.value = this.changes[this.historyIndex];
      this.onChange(this.value);
      this.onTouch();
    }
  }

  redoChanges() {
    if (this.historyIndex < this.changes.length - 1) {
      this.historyIndex++;
      this.changes.splice(this.historyIndex + 1);
      this.value = this.changes[this.historyIndex];
      this.onChange(this.value);
      this.onTouch();
    }
  }

  handleKeys(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') {
      this.isUndoing = true;
      this.undoChanges();
      this.isUndoing = false;
      event.preventDefault();
    } else if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
      this.redoChanges();
      event.preventDefault();
    } else if (event.key === 'Enter' && this.isBulletsActive) {
      this.bulletList();
    }
  }

  checkUpdate() {
    if (this.firstChange) {
      this.firstChange = false;
      this.addChanges();
    }
  }
}
