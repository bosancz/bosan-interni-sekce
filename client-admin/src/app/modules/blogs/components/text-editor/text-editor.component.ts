import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { debounceTime, filter } from 'rxjs/operators';

@Component({
  selector: 'bo-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ]
})
export class TextEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  editor!: EditorJS; // ! bcs loaded in afterviewinit

  data?: OutputData;

  @Input() autofocus?: boolean;

  @Input() autosaveDebounceTime: number = 250;

  @Input() autosave: boolean = false;

  @Output() change = new EventEmitter<void>();
  @Output() load = new EventEmitter<void>();

  /* ControlValueAccessor */
  onTouchedFn = () => { };
  onChangeFn = (value: string) => { };

  constructor(
    private elRef: ElementRef<HTMLElement>
  ) {
    this.change
      .pipe(filter(() => this.autosave))
      .pipe(debounceTime(this.autosaveDebounceTime))
      .subscribe(() => this.save());
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.editor = new EditorJS({
      holder: this.elRef.nativeElement,
      autofocus: this.autofocus,

      onChange: (api) => this.change.next(),
      onReady: () => {
        this.load.emit();
        if (this.data) this.editor.render(this.data);
      },

      tools: {
        header: <any>Header, // TODO https://github.com/editor-js/header/issues/23
      }
    });

  }

  ngOnDestroy() {
    this.editor.destroy();
  }

  /* Public API */
  async save() {
    this.data = await this.editor.save();
    this.onChangeFn(JSON.stringify(this.data));
    return this.data;
  }

  /* ControlValueAccessor */
  writeValue(value: string): void {
    try {
      this.data = JSON.parse(value);
      if (this.editor?.render && this.data) this.editor.render(this.data);
      console.log(value, this.data, this.editor, this.editor.render);
    }
    catch (err) {
      console.error(err);
    }
  }
  registerOnChange(fn: (data: string) => void): void {
    this.onChangeFn = fn;
  };
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  };
  setDisabledState?(isDisabled: boolean): void {
    this.editor.readOnly.toggle(isDisabled);
  }

}