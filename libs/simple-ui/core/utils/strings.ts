const STRING_DASHERIZE_REGEXP = /[ _]/g;
const STRING_DECAMELIZE_REGEXP = /([a-z\d])([A-Z])/g;
const STRING_CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;
const STRING_UNDERSCORE_REGEXP_1 = /([a-z\d])([A-Z]+)/g;
const STRING_UNDERSCORE_REGEXP_2 = /-|\s+/g;

/**
 * 将驼峰字符串转换为所有用下划线分隔的小写字母
 * @example
 *  ```
 *  decamelize('innerHTML')         // 'inner_html'
 *  decamelize('action_name')       // 'action_name'
 *  decamelize('css-class-name')    // 'css-class-name'
 *  decamelize('my favorite items') // 'my favorite items'
 *  ```
 */
export function decamelize(str: string): string {
  return str.replace(STRING_DECAMELIZE_REGEXP, '$1_$2').toLowerCase();
}

/**
 * 用中划线替换下划线、空格或驼峰。
 * @example
 *  ```
 *  dasherize('innerHTML')         // 'inner-html'
 *  dasherize('action_name')       // 'action-name'
 *  dasherize('css-class-name')    // 'css-class-name'
 *  dasherize('my favorite items') // 'my-favorite-items'
 *  ```
 */
export function dasherize(str: string): string {
  return decamelize(str).replace(STRING_DASHERIZE_REGEXP, '-');
}

/**
 * 返回小驼峰
 * @example
 *  ```
 *  camelize('innerHTML')         // 'innerHTML'
 *  camelize('action_name')       // 'actionName'
 *  camelize('css-class-name')    // 'cssClassName'
 *  camelize('my favorite items') // 'myFavoriteItems'
 *  camelize('My Favorite Items');  // 'myFavoriteItems'
 *  ```
 */
export function camelize(str: string): string {
  return str
    .replace(STRING_CAMELIZE_REGEXP, (_match: string, _separator: string, chr: string) => {
      return chr ? chr.toUpperCase() : '';
    })
    .replace(/^([A-Z])/, (match: string) => match.toLowerCase());
}

/**
 * 返回大驼峰
 * @example
 *  ```
 *  classify('innerHTML')         // 'InnerHTML'
 *  classify('action_name')       // 'ActionName'
 *  classify('css-class-name')    // 'CssClassName'
 *  classify('my favorite items') // 'MyFavoriteItems'
 *  ```
 */
export function classify(str: string): string {
  return str
    .split('.')
    .map(part => capitalize(camelize(part)))
    .join('.');
}

/**
 * 任何空格、驼峰、中划线、下划线转成下划线连接
 * @example
 *  ```
 *  underscore('innerHTML')         // 'inner_html'
 *  underscore('action_name')       // 'action_name'
 *  underscore('css-class-name')    // 'css_class_name'
 *  underscore('my favorite items') // 'my_favorite_items'
 *  ```
 */
export function underscore(str: string): string {
  return str.replace(STRING_UNDERSCORE_REGEXP_1, '$1_$2').replace(STRING_UNDERSCORE_REGEXP_2, '_').toLowerCase();
}

/**
 * 返回字符串的首字母大写形式
 * @example
 *  ```
 *  capitalize('innerHTML')         // 'InnerHTML'
 *  capitalize('action_name')       // 'Action_name'
 *  capitalize('css-class-name')    // 'Css-class-name'
 *  capitalize('my favorite items') // 'My favorite items'
 *  ```
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.substr(1);
}
