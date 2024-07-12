/// <reference types="./index.d.ts"> 

/**
 * 仿照 colors的api，借助ansi字符，做一个带有颜色的输出
 * 对于不支持颜色的控制台来说，可能会输出一些奇怪的ansi字符
 */
import util from 'util'; // nodejs 端，先不考虑 browser 端
import debug from 'debug';

const log = debug('colorcc');

const foreAnsiCode = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  gray: 90,
  grey: 90,
  brightBlack: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 99,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
};
const backAnsiCode = {
  bgBlack: 40,
  bgRed: 41,
  bgGreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
  bgGray: 100,
  bgGrey: 100,
  bgBrightBlack: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107,
};
const styleAnsiCode = {
  bold: 1,
  underline: 4,
  blink: 5,
  strike: 9,
};
export type ForeCodePropName = keyof typeof foreAnsiCode;
export type BackCodePropName = keyof typeof backAnsiCode;
export type StyleCodePropName = keyof typeof styleAnsiCode;
export type AllCodePropName = ForeCodePropName | BackCodePropName | StyleCodePropName;

// 函数名集合，完全和上面的属性值保持一致，目前暂时没想到比较好的办法，先穷举
const foreFuns: ForeCodePropName[] = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'grey',
  // 特有
  'brightBlack',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightMagenta',
  'brightCyan',
  'brightWhite',
];
const backFuns: BackCodePropName[] = [
  'bgBlack',
  'bgRed',
  'bgGreen',
  'bgYellow',
  'bgBlue',
  'bgMagenta',
  'bgCyan',
  'bgWhite',
  'bgGray',
  'bgGrey',
  // 特有
  'bgWhite',
  'bgBrightBlack',
  'bgBrightRed',
  'bgBrightGreen',
  'bgBrightYellow',
  'bgBrightBlue',
  'bgBrightMagenta',
  'bgBrightCyan',
  'bgBrightWhite',
];
const styleFuns: StyleCodePropName[] = [
  'bold',
  'underline',
  'blink',
  'strike',
  // 'normal'
  // 'reset',
  // 'dim',
  // 'italic',
  // 'inverse',
  // 'hidden',
  // 'strikethrough',
];

export interface ColorifyOptions {
  fore: ForeCodePropName;
  back: BackCodePropName;
  style: StyleCodePropName;
}

/**
 * 使得输出带上颜色
 * @param {string} text
 * @param {object} options
 * @returns {string}
 */
export function colorify(text: string | object, options?: Partial<ColorifyOptions>) {
  //
  const content = isObject(text) ? JSON.stringify(text) : text;
  //
  const { fore, back, style } = options || {};
  // if (!fore) {
  //   return content as string;
  // }

  const codes: number[] = [];
  const foreCode = foreAnsiCode[fore];
  isCorrectCode(foreCode) && codes.push(foreCode);
  const backCode = backAnsiCode[back];
  isCorrectCode(backCode) && codes.push(backCode);
  const styleCode = styleAnsiCode[style];
  isCorrectCode(styleCode) && codes.push(styleCode);

  const FIX_CHARS = '\x1b'; // "\033";
  const outStr = `${FIX_CHARS}[${codes.join(';')}m${content}${FIX_CHARS}[0m`; // eg: '\x1b[31m 我会变成红色文字 \x1b[m'
  // log('colorify::ansiCode:', { foreCode, backCode, styleCode });
  // log('colorify::', JSON.stringify(outStr));

  return outStr;
}

/**
 * 生成转换函数
 * @param {Partial<ColorifyOptions>} options
 * @returns {Function}
 */
function genFn(options?: Partial<ColorifyOptions>) {
  const { fore, back, style } = options || {};
  const hasNoParam = fore === undefined && back === undefined && style === undefined;
  const raw = (str: any) => str as string; // 不处理，原封不动返回

  //
  return function getColorfulText(...args: any[]) {
    // log('getColorfulText::', JSON.stringify({ hasNoParam, fore, back, style }));
    const aLen = args.length;
    if (args.length <= 1) {
      const res = aLen ? args[0] : '';
      return hasNoParam ? raw(res) : colorify(res, { fore, back, style });
    } else {
      const result = args.map(argItem => (hasNoParam ? raw(argItem) : colorify(argItem, { fore, back, style })));
      return result.join(' ');
    }
  };
}

// 单层函数
type ColorFunc = (...args: any[]) => string;

type StyleMethods = {
  [k in StyleCodePropName]: ColorFunc;
};

type BackMethods = {
  [k in BackCodePropName]: ColorFunc & StyleMethods;
};

type ForeMethods = {
  [k in ForeCodePropName]: ColorFunc & BackMethods & StyleMethods;
};

type AllMethods = ForeMethods & BackMethods & StyleMethods;

/**
 * type
 */
export type ColorTool = AllMethods & {
  //
  colorify: typeof colorify;
  //
  warn: ColorFunc; // [warn] xxx
  warning: ColorFunc; // [warn] xxx, (alias for warn)
  error: ColorFunc; // [error] xxx
  success: ColorFunc; // ✔️ xxxxx
  fail: ColorFunc; // ✘ xxxxx
  def: ColorFunc; // > xxx
};

/**
 * expose
 * @param {boolean} useColor 是否需要颜色
 * @returns {ColorTool} colorsTool
 * @example
 *  let colors = createColorfulTool(true);
 *  const msg = colors.fore.back.style(text);  //
 *  console.log(msg);
 * @description
 *  注意：fore,bg,style 可以反向逐级缺省，但是前后顺序不能乱 fore > back > style
 *  eg：
 *    - colors.red.bgRed.bold
 *    - colors.red.bold
 *    - colors.bgRed
 *    - colors.red
 */
export function createColorfulTool(useColor?: boolean) {
  const colorsTool: Partial<ColorTool> = {
    colorify,
  };
  const isProdEnv = process.env.NODE_ENV === 'production';
  //参数缺省时，非production环境变量，都需要带上颜色
  const needColor = useColor === undefined ? !isProdEnv : !!useColor;

  // 1.[colors.fore?.xxx?.xxx]
  for (const fKey of foreFuns) {
    // 1.1.[colors.fore],   eg: colors.red
    colorsTool[fKey] = (needColor ? genFn({ fore: fKey }) : genNoop()) as ColorFunc & BackMethods & StyleMethods;
    log(`F: colors.${fKey}`);
    // 1.2.[colors.fore.back],  eg: colors.red.bgYellow
    for (const bKey of backFuns) {
      colorsTool[fKey][bKey] = (needColor ? genFn({ fore: fKey, back: bKey }) : genNoop()) as ColorFunc & StyleMethods;
      log(`FB: colors.${fKey}.${bKey}`);
      // 1.3.[colors.fore.back.style],  eg: colors.red.bgYellow.bold
      for (const sKey of styleFuns) {
        colorsTool[fKey][bKey][sKey] = needColor ? genFn({ fore: fKey, back: bKey, style: sKey }) : genNoop();
        log(`FBS: colors.${fKey}.${bKey}.${sKey}`);
      }
    }
    // 1.4.[colors.fore.style],  eg: colors.red.bold
    for (const sKey of styleFuns) {
      (colorsTool[fKey] as StyleMethods)[sKey] = needColor ? genFn({ fore: fKey, style: sKey }) : genNoop();
      log(`FS: colors.${fKey}.${sKey}`);
    }
  }

  // [colors.back?.xx]
  for (const bKey of backFuns) {
    // [colors.back],  eg: colors.bgYellow
    colorsTool[bKey] = (needColor ? genFn({ back: bKey }) : genNoop()) as ColorFunc & StyleMethods;
    log(`B: colors.${bKey}`);
    // [colors.back.style],  eg: colors.bgYellow.bold
    for (const sKey of styleFuns) {
      colorsTool[bKey][sKey] = needColor ? genFn({ back: bKey, style: sKey }) : genNoop();
      log(`BS: colors.${bKey}.${sKey}`);
    }
  }

  // [colors.style],  eg: colors.bold
  for (const sKey of styleFuns) {
    (colorsTool as StyleMethods)[sKey] = needColor ? genFn({ style: sKey }) : genNoop();
    log(`S: colors.${sKey}`);
  }

  // 常规组合：warn error success fail
  // [warning] xxxxx
  colorsTool.warn = colorsTool.warning = function (str: any) {
    str = typeof str === 'string' ? str : JSON.stringify(str);
    const prefix = '[warn]';
    const colos = colorsTool as ForeMethods;
    const prefixColor = (colos.red as BackMethods).bgYellow(prefix);
    const space = ' '.repeat(prefix.length + 1);
    str = str?.replace('\r', '');
    return `${prefixColor} ${colorsTool.yellow(str.split('\n').join(`\n${space}`))}`;
  };
  // [error] xxxxx
  colorsTool.error = function (str: any) {
    str = typeof str === 'string' ? str : JSON.stringify(str);
    const prefix = '[error]';
    const colors = colorsTool as ForeMethods;
    const prefixColor = ((colors.red as BackMethods).bgBrightYellow as StyleMethods).bold(prefix);
    const space = ' '.repeat(prefix.length + 1);
    str = str?.replace('\r', '');
    return `${prefixColor} ${colorsTool.red.bold(str.split('\n').join(`\n${space}`))}`;
  };
  // ✔ xxxxx
  colorsTool.success = function (str: any) {
    str = typeof str === 'string' ? str : JSON.stringify(str);
    return `${colorsTool.green('✔')} ${str?.replace('\r', '')}`;
  };
  // ✘ xxxxx
  colorsTool.fail = function (str: any) {
    str = typeof str === 'string' ? str : JSON.stringify(str);
    return `${colorsTool.red('✘')} ${str?.replace('\r', '')}`;
  };
  // > xxxxx
  colorsTool.def = function (str: any) {
    str = typeof str === 'string' ? str : JSON.stringify(str);
    return `${colorsTool.gray('>')} ${str?.replace('\r', '')}`;
  };

  return colorsTool as ColorTool;
}

/**
 * ColorCC
 */
export const ColorCC = createColorfulTool(true);

//
export default ColorCC;

/*
// com
console.log('');
console.log(ColorCC.error('error text...'));
console.log(ColorCC.warn('warning text...'));
console.log(ColorCC.warning('warning text...'));
console.log(ColorCC.success('success text...'));
console.log(ColorCC.fail('fail text...'));

// F,  F.B,  F.S,  F.B.S
console.log('');
console.log(ColorCC.red('red'));
console.log(ColorCC.red.bgYellow('red.bgYellow'));
console.log(ColorCC.red.strike('red.strike'));
console.log(ColorCC.red.bgYellow.strike('red.bgYellow.strike'));

// B,  B.S
console.log('');
console.log(ColorCC.bgYellow('bgYellow'));
console.log(ColorCC.bgYellow.strike('bgYellow.strike'));

// S
console.log('');
console.log(ColorCC.bold('bold'));
console.log(ColorCC.underline('underline'));
console.log(ColorCC.blink('blink'));
console.log(ColorCC.strike('strike'));
*/

// =================================== common defines ==============================================

/**
 * 每次执行都产生一个新的空函数,主要是本案例中颜色函数本身上面还会挂颜色函数，
 * - 如果使用一个noop，会导致其子属性和自己形成循环依赖(noop.noop=noop, noop.noop.noop=noop)
 * @returns {Function} noop
 */
function genNoop() {
  // 原样输出
  const noop = (...args: any) => util.format(...args); // 每次都产生一个新的 noop 函数
  return noop;
}

/**
 * 判断是否具有正常的 ansicode
 * @param {unknown} code
 * @returns {boolean}
 */
function isCorrectCode(code: unknown): code is NonNullable<number> {
  // 原生 isNaN 对 understand 和 自定义 class 的实例会误判，不过这里不影响
  return !(code === undefined || code === null) && !isNaN(code as any); 
}

/**
 * 判断 object/array，会排除 null
 * @param {unknown} obj
 * @returns {boolean}
 */
function isObject(obj: unknown): obj is NonNullable<object> {
  return obj !== null && typeof obj === 'object';
}
