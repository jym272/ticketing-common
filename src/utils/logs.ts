import chalk from 'chalk';
import { sc } from '@events/nats';

// eslint-disable-next-line no-console
export const log = console.log;

export const successConnectionMsg = (msg: string) => log('\x1b[32m%s\x1b[0m', msg);
//TODO: pensar bien cuando activar logging, si NODE_ENV no es test, los tests fallan por https
export const activateLogging = () => !(process.env.NODE_ENV === 'test');

const chalkColors = ['blueBright', 'cyanBright', 'magentaBright', 'yellowBright'];

export const colorObject = (obj: Record<never, unknown>, level = 0): string => {
  const colorIndex = level % chalkColors.length;

  return `{ ${Object.entries(obj).reduce((acc, [key, value], i, arr) => {
    let coloredValue = value;
    if (typeof value === 'object' && value !== null) {
      coloredValue = colorObject(value, level + 1);
    } else {
      coloredValue = chalk`{green ${JSON.stringify(value)}}`;
    }
    const addBold = level === 0 ? 'bold.' : '';
    acc += chalk`{${addBold}${chalkColors[colorIndex]} ${key}}: ${coloredValue}`;

    if (i < arr.length - 1) {
      acc += ', ';
    }
    return acc;
  }, '')} }`;
};
export const logMessage = (data: Uint8Array) => {
  const msgString = sc.decode(data);
  const msg = JSON.parse(msgString) as Record<string, unknown>;
  return colorObject(msg);
};
