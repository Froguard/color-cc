# color-cc

> Get colors in your node.js console, Similar to [colors](https://www.npmjs.com/package/colors), but a simplified version of it

> Just work in Node.js

> Support js / ts / es

## install

```sh
npm i -S color-cc
# yarn add color-cc
```

## usage

### 1.commonjs

```js
const ColorCC = require('color-cc').default;

console.log(ColorCC.green('hello'));
console.log(ColorCC.red.underline('i like cake and pies'));

console.log(ColorCC.success('I have finished my work!'));
console.log(ColorCC.fail('It is not be done!'));
console.warn(ColorCC.warn('warning something...'));
console.error(ColorCC.error('It occurs errors!'));
```

> don't forget the `.default` !!!

### 2.typescript/esnext

```ts
import ColorCC from 'color-cc';
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
```


## API

> Similar to colors, but a simplified version of colors

> function like: `(...args:[]) => string` 

#### fore,back,style

- ColorCC.${foreName}
  - eg: `ColorCC.red('abcdefg')`
- ColorCC.${foreName}.${backName}
  - eg: `ColorCC.red.bgYellow('abcdefg')`
- ColorCC.${foreName}.${backName}.${styleName}
  - eg: `ColorCC.red.bgYellow.bold('abcdefg')`
- ColorCC.${foreName}.${styleName}
  - eg: `ColorCC.red.bold('abcdefg')`
- ColorCC.${backName}
  - eg: `ColorCC.bgYellow('abcdefg')`
- ColorCC.${backName}.${styleName}
  - eg: `ColorCC.bgYellow.bold('abcdefg')`
- ColorCC.${styleName}
  - eg: `ColorCC.bold('abcdefg')`

##### ansi prop name

```ts
// foreNames
type ForeCodePropName = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white" | "gray" | "grey" | "brightBlack" | "brightRed" | "brightGreen" | "brightYellow" | "brightBlue" | "brightMagenta" | "brightCyan" | "brightWhite";
// backNames
type BackCodePropName = "bgBlack" | "bgRed" | "bgGreen" | "bgYellow" | "bgBlue" | "bgMagenta" | "bgCyan" | "bgWhite" | "bgGray" | "bgGrey" | "bgBrightBlack" | "bgBrightRed" | "bgBrightGreen" | "bgBrightYellow" | "bgBrightBlue" | "bgBrightMagenta" | "bgBrightCyan" | "bgBrightWhite";
// styleNames
type StyleCodePropName = "bold" | "underline" | "blink" | "strike";
```

#### Common combinations

- ColorCC.warn
- ColorCC.error
- ColorCC.success
- ColorCC.fail


#### custom

- ColorCC.colorify(text: string, options?: Partial<ColorifyOptions>)
