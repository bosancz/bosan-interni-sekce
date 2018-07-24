import { Component, Input } from '@angular/core';

import { Contact } from "../../schema/contact";

@Component({
  selector: 'contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent {

  @Input()
  contact:Contact;
  
  constructor() { }

}