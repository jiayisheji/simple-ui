import { InjectionToken } from '@angular/core';

export interface HighlightJSApi {
  highlight: (languageName: string, code: string, ignoreIllegals?: boolean, continuation?: Mode) => HighlightResult;
  highlightAuto: (code: string, languageSubset?: string[]) => AutoHighlightResult;
  fixMarkup: (html: string) => string;
  highlightBlock: (element: HTMLElement) => void;
  configure: (options: Partial<HighlightConfig>) => void;
  initHighlighting: () => void;
  initHighlightingOnLoad: () => void;
  registerLanguage: (languageName: string, language: LanguageFn) => void;
  listLanguages: () => string[];
  registerAliases: (aliasList: string | string[], { languageName }: { languageName: string }) => void;
  getLanguage: (languageName: string) => Language | undefined;
  requireLanguage: (languageName: string) => Language | never;
  autoDetection: (languageName: string) => boolean;
  inherit: <T>(original: T, ...args: Record<string, any>[]) => T;
  addPlugin: (plugin: HLJSPlugin) => void;
  debugMode: () => void;
  safeMode: () => void;
  versionString: string;
}

export type LanguageFn = (hljs?: HighlightJSApi) => Language;

export interface HighlightResult {
  relevance: number;
  value: string;
  language?: string;
  emitter: Emitter;
  illegal: boolean;
  top?: Language | CompiledMode;
  illegalBy?: IllegalData;
  sofar?: string;
  errorRaised?: Error;
  // * for auto-highlight
  second_best?: Omit<HighlightResult, 'second_best'>;
}
// tslint:disable-next-line: no-empty-interface
export interface AutoHighlightResult extends HighlightResult {}

interface IllegalData {
  msg: string;
  context: string;
  mode: CompiledMode;
}

type PluginEvent = 'before:highlight' | 'after:highlight' | 'before:highlightBlock' | 'after:highlightBlock';

type HLJSPlugin = {
  [K in PluginEvent]?: any;
};

interface CallbackResponse {
  data: Record<string, any>;
  ignoreMatch: () => void;
}

/************
 PRIVATE API
 ************/

/* for jsdoc annotations in the JS source files */
type AnnotatedError = Error & {
  mode?: Mode | Language;
  languageName?: string;
  badRule?: Mode;
};

type ModeCallback = (match: RegExpMatchArray, response: CallbackResponse) => void;
type HighlightedHTMLElement = HTMLElement & {
  result?: object;
  second_best?: object;
  parentNode: HTMLElement;
};
type EnhancedMatch = RegExpMatchArray & { rule: CompiledMode; type: MatchType };
type MatchType = 'begin' | 'end' | 'illegal';

interface Emitter {
  addKeyword(text: string, kind: string): void;
  addText(text: string): void;
  toHTML(): string;
  finalize(): void;
  closeAllNodes(): void;
  openNode(kind: string): void;
  closeNode(): void;
  addSublanguage(emitter: Emitter, subLanguageName: string): void;
}

/* modes */

interface ModeCallbacks {
  'on:end'?: Function;
  'on:begin'?: Function;
}

export interface Mode extends ModeCallbacks, ModeDetails {}

interface LanguageDetail {
  name?: string;
  rawDefinition?: () => Language;
  aliases?: string[];
  disableAutodetect?: boolean;
  contains: ('self' | Mode)[];
  case_insensitive?: boolean;
  keywords?: Record<string, any> | string;
  compiled?: boolean;
}

export type Language = LanguageDetail & Partial<Mode>;

interface CompiledLanguage extends LanguageDetail, CompiledMode {
  compiled: true;
  contains: CompiledMode[];
  keywords: Record<string, any>;
}

type KeywordData = [string, number];
type KeywordDict = Record<string, KeywordData>;

type CompiledMode = Omit<Mode, 'contains'> & {
  contains: CompiledMode[];
  keywords: KeywordDict;
  data: Record<string, any>;
  terminator_end: string;
  keywordPatternRe: RegExp;
  beginRe: RegExp;
  endRe: RegExp;
  illegalRe: RegExp;
  matcher: any;
  compiled: true;
  starts?: CompiledMode;
  parent?: CompiledMode;
};

interface ModeDetails {
  begin?: RegExp | string;
  end?: RegExp | string;
  className?: string;
  contains?: ('self' | Mode)[];
  endsParent?: boolean;
  endsWithParent?: boolean;
  endSameAsBegin?: boolean;
  skip?: boolean;
  excludeBegin?: boolean;
  excludeEnd?: boolean;
  returnBegin?: boolean;
  returnEnd?: boolean;
  __beforeBegin?: Function;
  parent?: Mode;
  starts?: Mode;
  lexemes?: string | RegExp;
  keywords?: Record<string, any> | string;
  beginKeywords?: string;
  relevance?: number;
  illegal?: string | RegExp;
  variants?: Mode[];
  cached_variants?: Mode[];
  // parsed
  subLanguage?: string | string[];
  compiled?: boolean;
}

export interface HighlightConfig {
  /** 一个用于替换缩进中的TAB字符的字符串。 */
  tabReplace?: string;
  /** 一个用于在输出中生成<br>标记而不是换行符的标志，当使用非<pre>容器标记代码时很有用。 */
  useBR?: boolean;
  /** 在生成的标记中的类名称之前添加的字符串前缀，用于与样式表向后兼容。 */
  classPrefix?: string;
  /** 语言名称和别名的数组，将自动检测限制为仅这些语言。 */
  languages?: string[];
  /** 一个正则表达式，用于配置CSS类名称如何映射到语言（允许诸如color-as-php之类的类名称与language-php的默认类，等等） */
  languageDetectRe: RegExp;
  /** 一个正则表达式，用于配置要完全跳过哪些CSS类。 */
  noHighlightRe: RegExp;
}

export interface SimHighlightOptions {
  /** 设置 Highlight Config */
  config?: HighlightConfig;
  /** 加载高亮语言 */
  languages?: { [name: string]: () => Promise<any> };
  /** 加载 Highlight core 库 */
  coreLibraryLoader?: () => Promise<any>;
  /** 加载 Highlight 全量库 */
  fullLibraryLoader?: () => Promise<any>;
}

export const SIM_HIGHLIGHT_OPTIONS = new InjectionToken<SimHighlightOptions>('SIM_HIGHLIGHT_OPTIONS');
