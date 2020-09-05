import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'doc-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnInit {
  constructor(elementRef: ElementRef, renderer: Renderer2) {
    const { nativeElement } = elementRef;
    renderer.addClass(nativeElement, 'doc-viewer');
    renderer.addClass(nativeElement, 'sim-typography');
  }

  ngOnInit(): void {}
}
