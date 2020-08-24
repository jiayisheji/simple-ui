import { ElementRef } from '@angular/core';
import { body } from '@ngx-simple/simple-ui/testing';
import { toElement } from './element';

describe('toElement', () => {
  it('should coerce an ElementRef into an element', () => {
    if (body) {
      const ref = new ElementRef(body);
      expect(toElement(ref)).toBe(body);
    }
  });

  it('should return the element, if a native element is passed in', () => {
    if (body) {
      expect(toElement(body)).toBe(body);
    }
  });
});
