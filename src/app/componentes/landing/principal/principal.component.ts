import { Component, OnInit } from '@angular/core';
import { faTools,faBusinessTime,faUserSecret,faScroll} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  faTools = faTools;
  faBusinessTime = faBusinessTime;
  faUserSecret = faUserSecret;
  faScroll = faScroll;
  
  constructor() { }

  ngOnInit(): void {
  }

}
