import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'doc-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ApiComponent implements OnInit {
  constructor(elementRef: ElementRef, renderer: Renderer2) {
    const { nativeElement } = elementRef;
    renderer.addClass(nativeElement, 'doc-api');
    renderer.addClass(nativeElement, 'sim-typography');
  }

  ngOnInit(): void {}
}
