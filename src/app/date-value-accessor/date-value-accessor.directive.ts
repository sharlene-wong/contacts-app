import { Directive, ElementRef, forwardRef, HostListener, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const DATE_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective), // trying to use it before it's defined.
  multi: true, // there are multiple providers registered as NG_VALUE_ACCESSORS;
};

@Directive({
  selector: 'input([type=date])[formControlName], input([type=date])[formControl], input([type=date])[ngModel]',
  providers: [DATE_VALUE_PROVIDER]
})
export class DateValueAccessorDirective implements ControlValueAccessor {

  constructor(private element: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  private onChange!: Function;

  @HostListener('blur')
  private onTouched!: Function;

  registerOnChange(fn: Function) {
    this.onChange = (valueAsDate: Date) => { fn(valueAsDate); };
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  // when the user changes the value of control, need to populate the template value with the new value, which is a Date object. But the date input expects a string in the format 'yyyy-MM-dd', so we need to convert the Date object to a string in that format.
  writeValue(newValue: any) {
    if (newValue instanceof Date) {
      this.element.nativeElement.value = newValue.toISOString().split('T')[0]; // 'yyyy-MM-dd' format for date input
    }
  }


}
