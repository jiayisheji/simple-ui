import { createComponentFactory, createHostFactory, Spectator, SpectatorHost } from '@ngneat/spectator/jest';
import { SimDividerComponent } from './divider.component';
import { SimDividerModule } from './divider.module';

describe('SimDivider', () => {
  let spectator: Spectator<SimDividerComponent>;

  /** Get the `<sim-divider></sim-divider>` */
  const getSimDivider = () => spectator.query('.sim-divider', { root: true });

  const createComponent = createComponentFactory({
    component: SimDividerComponent,
    imports: [SimDividerModule],
    detectChanges: false,
    declareComponent: false
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create the divider', () => {
    const divider = getSimDivider();
    expect(divider).toExist();
    spectator.detectChanges();
    // Check the default
    expect(divider).toHaveClass('sim-divider-horizontal');
    expect(divider).not.toHaveClass('sim-divider-inset');
    expect(divider).not.toHaveClass('sim-divider-dashed');
    expect(divider).not.toHaveClass('sim-divider-vertical');
    expect(divider).not.toHaveClass('sim-divider-inner-text');
    expect(divider).toHaveStyle({
      margin: 0
    });
  });

  it('should add aria roles properly', () => {
    expect(getSimDivider()).toHaveAttribute('role', 'separator');
  });

  it('should apply vertical class to vertical divider', () => {
    spectator.setInput('vertical', true);
    spectator.detectChanges();
    expect(getSimDivider()).toHaveClass('sim-divider-vertical');
    expect(getSimDivider()).not.toHaveClass('sim-divider-horizontal');
  });

  it('should apply inset class to inset divider', () => {
    spectator.setInput('inset', true);
    spectator.detectChanges();

    expect(getSimDivider()).toHaveClass('sim-divider-inset');
  });

  it('should apply dashed class to dashed divider', () => {
    spectator.setInput('dashed', true);
    spectator.detectChanges();

    expect(getSimDivider()).toHaveClass('sim-divider-dashed');
  });

  describe('should add margin to divider style', () => {
    ['10px', '10px 20px', '10px 15px 20px', '10px 20px 15px 10px'].forEach(value => {
      it(`with "${value}"`, () => {
        spectator.setInput('margin', value);
        spectator.detectChanges();
        expect(getSimDivider()).toHaveStyle({
          margin: value
        });
      });
    });
    const exception = '10px 10px 10px 10px 10px';
    it(`with "${exception}"`, () => {
      spectator.setInput('margin', exception);
      spectator.detectChanges();
      expect(getSimDivider()).toHaveStyle(null);
    });
  });
});

describe('SimDividerText', () => {
  let spectator: SpectatorHost<SimDividerComponent>;

  const createHost = createHostFactory({
    component: SimDividerComponent,
    imports: [SimDividerModule],
    detectChanges: false,
    declareComponent: false
  });

  /** Get the `<sim-divider></sim-divider>` */
  const getSimDivider = () => spectator.query('.sim-divider', { root: true });

  describe('should add text to divider', () => {
    ['with text', null].forEach(value => {
      it(`with "${value || 'empty text'}"`, () => {
        spectator = createHost(`<sim-divider>
        <sim-divider-inner-text>${value}</sim-divider-inner-text>
      </sim-divider>`);
        spectator.detectChanges();
        expect(getSimDivider()).toHaveClass('sim-divider-text');
      });
    });
  });

  describe('should add text align to divider', () => {
    ['start', 'end', 'center', null, '', undefined].forEach(value => {
      it(`with "${value || 'default'}"`, () => {
        spectator = createHost(`<sim-divider>
        <sim-divider-inner-text>with text</sim-divider-inner-text>
      </sim-divider>`);
        spectator.setInput('align', value as 'start' | 'end');
        spectator.detectChanges();
        if (value == null) {
          expect(getSimDivider()).not.toHaveAttribute('align');
        } else {
          expect(getSimDivider()).toHaveAttribute('align', value);
        }
      });
    });
  });

  it('should apply vertical not show text to divider', () => {
    const expected = 'with text';
    spectator = createHost(`<sim-divider>
        <sim-divider-inner-text>${expected}</sim-divider-inner-text>
      </sim-divider>`);
    spectator.setInput('vertical', true);
    spectator.detectChanges();
    expect(getSimDivider()).not.toHaveClass('sim-divider-inner-text');
    expect(getSimDivider()).toContainText(expected);
  });
});
