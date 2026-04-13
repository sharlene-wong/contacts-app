import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service'
import { PhoneTypeValues } from '../contacts/contact.model';
import { AddressTypeValues } from '../contacts/contact.model';
import { restrictedWords } from '../validators/restrictive-words.validator';
import { DateValueAccessorDirective } from '../date-value-accessor/date-value-accessor.directive';
import { ProfileIconSelectorComponent } from "../profile-icon-selector/profile-icon-selector.component";

@Component({
  imports: [CommonModule, ReactiveFormsModule, DateValueAccessorDirective, ProfileIconSelectorComponent],
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  phoneTypeValues = PhoneTypeValues;
  addressTypeValues = AddressTypeValues;
  contactForm = this.fb.nonNullable.group({
    id: '',
    icon: '',
    personal: false,
    //firstName: new FormControl('', Validators.required),
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: '',
    dateOfBirth: <Date | null>null, // adding the type fixes setValues method
    //dateOfBirth: '', // keeping it as a string to avoid issues with the date input, which expects a string in the format 'yyyy-MM-dd'
    favoritesRanking: <number | null>null, // adding the type fixes setValues method
    // phone: this.fb.nonNullable.group({
    //   phoneNumber: '',
    //   phoneType: '',
    // }),
    // phone: this.createPhoneGroup(),
    phones: this.fb.array([this.createPhoneGroup()]),
    address: this.fb.nonNullable.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      addressType: ['', Validators.required],
    }),
    notes: ['', restrictedWords(['foo', 'bar'])],
  });

  // contactFormOld = new FormGroup({
  //   id: new FormControl<string>('', { nonNullable: true }),
  //   firstName: new FormControl(''),
  //   lastName: '',
  //   dateOfBirth: new FormControl<Date | null>(null),
  //   favoritesRanking: new FormControl<number | null>(null),
  // });

  constructor(
    private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return

    // returns an Observable so you need a subscription to get the data
    this.contactsService.getContact(contactId).subscribe((contact) => {
      if (!contact) return;

      for (let i = 1; i < contact.phones.length; i++) {
        this.addPhone();
      }

      this.contactForm.setValue(contact);

      // const names = { firstName: contact.firstName, lastName: contact.lastName };
      // this.contactForm.patchValue(names); // patchValue allows you to update only part of the form

      // Old way: (while setValue requires all fields to be updated)
      // this.contactForm.controls.id.setValue(contact.id);
      // this.contactForm.controls.firstName.setValue(contact.firstName);
      // this.contactForm.controls.lastName.setValue(contact.lastName);
      // this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
      // this.contactForm.controls.favoritesRanking.setValue(contact.favoritesRanking);
      // this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
      // this.contactForm.controls.phone.controls.phoneNumber.setValue(contact.phone.phoneNumber);
      // this.contactForm.controls.phone.controls.phoneType.setValue(contact.phone.phoneType);
      // this.contactForm.controls.address.controls.streetAddress.setValue(contact.address.streetAddress);
      // this.contactForm.controls.address.controls.city.setValue(contact.address.city);
      // this.contactForm.controls.address.controls.state.setValue(contact.address.state);
      // this.contactForm.controls.address.controls.postalCode.setValue(contact.address.postalCode);
      // this.contactForm.controls.address.controls.addressType.setValue(contact.address.addressType);

      this.contactForm.setValue(contact); // One line vs 13 lines of code.
    });
  }

  createPhoneGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false,
    });

    phoneGroup.controls.preferred.valueChanges.subscribe(value => {

    });

    return phoneGroup;
  }

  addPhone() {
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  saveContact() {
      // console.log(this.contactForm.controls.dateOfBirth.value, typeof this.contactForm.controls.dateOfBirth.value);
      this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts'])
    });
  }
}
