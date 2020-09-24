import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator/jest';
import { SimSecretPipe } from './secret.pipe';

describe('SimSecretPipe', () => {
  let spectator: SpectatorPipe<SimSecretPipe>;
  const createPipe = createPipeFactory({
    pipe: SimSecretPipe,
    mocks: []
  });

  it('should ', () => {
    spectator = createPipe(`{{ 'value' | secret }}`);
    expect(spectator.element).toHaveText('*****');
  });

  it('should 1', () => {
    spectator = createPipe(`{{ 'value' | secret: 1 }}`);
    expect(spectator.element).toHaveText('v****');
  });

  it('should 2', () => {
    spectator = createPipe(`{{ 'value' | secret: 1:3 }}`);
    expect(spectator.element).toHaveText('v***e');
  });

  it('should 3', () => {
    spectator = createPipe(`{{ '0123456789' | secret: 1:3:7 }}`);
    expect(spectator.element).toHaveText('0***456***');
  });

  it('should 4', () => {
    spectator = createPipe(`{{ '13412345678' | secret: 3:6 }}`);
    expect(spectator.element).toHaveText('134****5678');
  });
});
