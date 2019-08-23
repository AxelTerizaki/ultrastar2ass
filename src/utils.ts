import {promisify} from 'util';
import {exists, readFile, writeFile} from 'fs';


const passThroughFunction = (fn: any, args: any) => {
	if(!Array.isArray(args)) args = [args];
	return promisify(fn)(...args);
};

export const asyncExists = (file: string) => passThroughFunction(exists, file);
export const asyncReadFile = (...args: any) => passThroughFunction(readFile, args);
export const asyncWriteFile = (...args: any) => passThroughFunction(writeFile, args);

export function msToAss(ms: number): string {
	const date = new Date(ms);
	const hour = date.getUTCHours();
	const hourStr = `${hour}`.padStart(2, '0');
	const min  = date.getUTCMinutes();
	const minStr = `${min}`.padStart(2, '0');
	const sec  = date.getUTCSeconds();
	const secStr = `${sec}`.padStart(2, '0');
	const mil  = date.getUTCMilliseconds();
	const milStr = `${mil}`.padStart(3, '0');
	return `${hourStr}:${minStr}:${secStr}.${milStr.substr(0, 2)}`;
}


export function clone(a: any) {
	return JSON.parse(JSON.stringify(a));
}
