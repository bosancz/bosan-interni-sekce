import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MemberGroupID, MemberGroups } from 'app/config/member-groups';
import { WebConfigGroup } from 'app/schema/web-config';


@Component({
  selector: 'groups-select',
  templateUrl: './groups-select.component.html',
  styleUrls: ['./groups-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GroupsSelectComponent),
    }
  ],
  host: {
    "[class.disabled]": "disabled",
    "[class.readonly]": "readonly",
  }
})
export class GroupsSelectComponent implements OnInit, ControlValueAccessor {

  groups = Object.entries(MemberGroups).map(entry => ({ id: <MemberGroupID>entry[0], ...entry[1] }));
  selectedGroups: string[] = [];

  disabled: boolean = false;
  @Input() readonly: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(groups: any): void { this.selectedGroups = groups || []; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.selectedGroups = [];
  }

  constructor() { }

  ngOnInit() {
  }

  isSelected(group: WebConfigGroup) {
    return this.selectedGroups.indexOf(group.id) !== -1;
  }

  selectAll(checked: boolean): void {

    if (this.disabled || this.readonly) return;

    if (checked) this.selectedGroups = this.groups.filter(group => group.children).map(group => group.id);
    else this.selectedGroups = [];
    this.onChange(this.selectedGroups);
  }

  isSelectedAll(): boolean {
    return !this.groups.filter(group => group.children).some(group => this.selectedGroups.indexOf(group.id) === -1);
  }

  toggleGroup(group: WebConfigGroup, deselectOther = false) {

    if (this.disabled || this.readonly) return;

    let i = this.selectedGroups.indexOf(group.id);
    if (i === -1) {
      if (deselectOther) this.selectedGroups = [];
      this.selectedGroups.push(group.id);
    }
    else this.selectedGroups.splice(i, 1);
    this.onChange(this.selectedGroups);
  }

}
