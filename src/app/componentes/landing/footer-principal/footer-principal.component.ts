import { Component, OnInit } from '@angular/core';
import {faGithub } from '@fortawesome/free-brands-svg-icons'
@Component({
  selector: 'app-footer-principal',
  templateUrl: './footer-principal.component.html',
  styleUrls: ['./footer-principal.component.css']
})
export class FooterPrincipalComponent implements OnInit {
  faGithub = faGithub
  constructor() { }

  ngOnInit(): void {
  }

}
