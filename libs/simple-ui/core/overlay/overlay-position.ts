import { ConnectionPositionPair } from '@angular/cdk/overlay';

export const POSITION_MAP: { [key: string]: ConnectionPositionPair } = {
  top: new ConnectionPositionPair({ originX: 'center', originY: 'top' }, { overlayX: 'center', overlayY: 'bottom' }),
  topStart: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
  topEnd: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
  right: new ConnectionPositionPair({ originX: 'end', originY: 'center' }, { overlayX: 'start', overlayY: 'center' }),
  rightStart: new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'start', overlayY: 'top' }),
  rightEnd: new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'start', overlayY: 'bottom' }),
  bottom: new ConnectionPositionPair({ originX: 'center', originY: 'bottom' }, { overlayX: 'center', overlayY: 'top' }),
  bottomStart: new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
  bottomEnd: new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
  left: new ConnectionPositionPair({ originX: 'start', originY: 'center' }, { overlayX: 'end', overlayY: 'center' }),
  leftStart: new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'end', overlayY: 'top' }),
  leftEnd: new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'end', overlayY: 'bottom' })
};
