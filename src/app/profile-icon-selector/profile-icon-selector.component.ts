import { Component, forwardRef, Provider } from '@angular/core';
import { profileIconNames } from './profile-icon-names';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const PROFILE_ICON_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProfileIconSelectorComponent), // trying to use it before it's defined.
  multi: true, // there are multiple providers registered as NG_VALUE_ACCESSORS;
};

@Component({
  selector: 'con-profile-icon-selector',
  imports: [],
  templateUrl: './profile-icon-selector.component.html',
  styleUrls: ['./profile-icon-selector.component.css'],
  providers: [PROFILE_ICON_VALUE_PROVIDER], // register the component as a provider for NG_VALUE_ACCESSOR, which allows it to be used as a form control in reactive forms.
})
export class ProfileIconSelectorComponent implements ControlValueAccessor {
  profileIcons = profileIconNames;
  showAllIcons: boolean = true;
  selectedIcon!: string | null;
  private onChange!: Function;
  private onTouched!: Function;

  writeValue(icon: string | null) {
    this.selectedIcon = icon;

    if(icon && icon !== '') {
      this.showAllIcons = false;
    } else {
      this.showAllIcons = true;
    }
  }

  registerOnChange(fn: Function) {
    this.onChange = (icon: string) => { fn(icon); };
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  iconSelected(icon: string) {
    this.showAllIcons = false;
    this.selectedIcon = icon;
    this.onChange(icon);
  }
}
