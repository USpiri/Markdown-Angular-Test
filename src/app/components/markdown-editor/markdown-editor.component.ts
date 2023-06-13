import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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

  @Input() value: string = '';
  @ViewChild('editor') editor!: ElementRef;

  onChange = (value: any) => {};
  onTouch = () => {};

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(onChange: (value: any) => void) {
    this.onChange = (value: string) => {
      this.addChanges();
      this.value = value;
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
      this.addChanges();
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, end + 4);
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
      this.addChanges();
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, end + 2);
      }, 0);
    }
    this.onChange(this.value);
    this.onTouch();
  }

  addChanges() {
    this.historyIndex++;
    if (this.historyIndex < this.changes.length) {
      this.changes.splice(this.historyIndex);
    }
    this.changes.push(this.value);
    // this.onChange(this.value);
  }

  undoChanges() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.value = this.changes[this.historyIndex];
      this.onChange(this.value);
    }
  }

  handleKeys(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'z') {
      event.preventDefault();
      this.undoChanges();
    }
  }

  onValueChange(event: Event) {
    console.log('CHANGE');
  }

  checkUpdate() {
    if (this.firstChange) {
      this.firstChange = false;
      this.addChanges();
    }
  }
}
