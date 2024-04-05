
import ColorCC from './index';

// com
console.log('');
console.log(ColorCC.error('error text...'));
console.log(ColorCC.warn('warning text...'));
console.log(ColorCC.warning('warning text...'));
console.log(ColorCC.success('success text...'));
console.log(ColorCC.fail('fail text...'));
console.log(ColorCC.def('default text...'));

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
    