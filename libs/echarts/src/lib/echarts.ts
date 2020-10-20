import { ECharts, ERectangle } from 'echarts';

export interface EchartsConstructor {
  /**
   * Creates an ECharts instance, and returns an echartsInstance. You shall
   *     not initialize multiple ECharts instances on a single container.
   *
   * @param {HTMLDivElement | HTMLCanvasElement} dom Instance container,
   *     usually is a `div` element with height and width defined.
   * @param {object | string} [theme] Theme to be applied.
   *     This can be a configuring object of a theme, or a theme name
   *     registered through [echarts.registerTheme](https://echarts.apache.org/api.html#echarts.registerTheme).
   * @param {object} [opts] Chart configurations.
   * @param {number} [opts.devicePixelRatio] Ratio of one physical pixel to
   *     the size of one device independent pixels. Browser's
   *     `window.devicePixelRatio` is used by default.
   * @param {string} [opts.renderer] Supports `'canvas'` or `'svg'`.
   *     See [Render by Canvas or SVG](https://echarts.apache.org/tutorial.html#Render%20by%20Canvas%20or%20SVG).
   * @param {number} [opts.width] Specify width explicitly, in pixel.
   *     If setting to `null`/`undefined`/`'auto'`, width of `dom`
   *     (instance container) will be used.
   * @param {number} [opts.height] Specify height explicitly, in pixel.
   *     If setting to `null`/`undefined`/`'auto'`, height of `dom`
   *     (instance container) will be used.
   */
  init(
    dom: HTMLDivElement | HTMLCanvasElement,
    theme?: object | string,
    opts?: {
      devicePixelRatio?: number;
      renderer?: string;
      width?: number | string;
      height?: number | string;
    }
  ): ECharts;

  /**
   * Connects interaction of multiple chart series. For example:
   *
   * ```js
   * // set group id of each instance respectively.
   * chart1.group = 'group1';
   * chart2.group = 'group1';
   * echarts.connect('group1');
   * // or incoming instance array that need to be linked.
   * echarts.connect([chart1, chart2]);
   *
   * @param group Group id in string, or array of chart instance.
   */
  connect(group: string | ECharts[]): void;

  /**
   * Disconnects interaction of multiple chart series. To have one single
   * instance to be removed, you can set `group` of chart instance to be null.
   *
   * @param {string} group Group id in string.
   */
  disConnect(group: string): void;

  /**
   * Destroys chart instance, after which the instance cannot be used any
   *     more.
   *
   * @param target Chart instance or container.
   */
  dispose(target: ECharts | HTMLDivElement | HTMLCanvasElement): void;

  /**
   * Returns chart instance of dom container.
   *
   * @param target Chart container.
   */
  getInstanceByDom(target: HTMLDivElement | HTMLCanvasElement): ECharts;

  /**
   * Registers available maps. This can only be used after including
   * [geo](https://echarts.apache.org/option.html#geo)
   * component or chart series of
   * [map](https://echarts.apache.org/option.html#series-map).
   *
   * @param {string} mapName Map name, referring to `map` value set in
   *     [geo](https://echarts.apache.org/option.html#geo)
   *     component or
   *     [map](https://echarts.apache.org/option.html#series-map).
   * @param {object} geoJson Data in GeoJson format. See
   *     [http://geojson.org/](http://geojson.org/) for more format information.
   * @param {object} [specialAreas] Zoomed part of a specific area in the map
   *     for better visual effect.
   *     See [USA Population Estimates example](https://echarts.apache.org/examples/en/editor.html?c=map-usa).
   */
  registerMap(mapName: string, geoJson: object, specialAreas?: object): void;

  /**
   * Registers a theme, should be specified when
   * [initialize the chart instance](https://echarts.apache.org/api.html#echarts.init).
   *
   * @param {string} themeName Theme name.
   * @param {object} theme Theme configurations.
   */
  registerTheme(themeName: string, theme: object): void;

  /**
   * Get a registed map.
   *
   * @param {string} mapName Map name.
   * @return {MapObj} Map data.
   */
  getMap(
    mapName: string
  ): {
    /**
     * geoJson data for map
     */
    geoJson: object;
    /**
     * special areas fro map
     */
    specialAreas: object;
  };

  /**
   * Util methods about graphics.
   */
  graphic: {
    /**
     * x, y, x2, y2 are all percent from 0 to 1
     */
    LinearGradient: zrender.LinearGradient;

    /**
     * Clip the given points by the given rectangular.
     *
     * @param {number[][]} points The points to be clipped,
     *     like [[23, 44], [12, 15], ...].
     * @param {ERectangle} rect The rectangular that is used to clip points.
     */
    clipPointsByRect(points: number[][], rect: ERectangle): number[][];

    /**
     * Clip the first input rectangular by the second input rectangular.
     *
     * @param {ERectangle} targetRect The rectangular to be clipped.
     * @param {ERectangle} rect The rectangular that is used to clip
     *     targetRect.
     */
    clipRectByRect(targetRect: ERectangle, rect: ERectangle): ERectangle;
  };
}
