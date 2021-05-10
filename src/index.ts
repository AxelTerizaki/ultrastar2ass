#!/usr/bin/env node
import { asyncExists, asyncReadFile, clone, msToAss } from './utils';
import UltrastarParser from './ultrastar';
import stringify from 'ass-stringify';
import { SyllabesConfig } from './types';
import ass = require('./assTemplate');

function generateASSLine(line: any, styles: any, duet: boolean) {
	const ASSLine = [];
	let startMs = line.start;
	const stopMs = line.end + 100;
	line.syllables.forEach((syl: any) => ASSLine.push('{\\k' + Math.floor(syl.duration / 10) + '}' + syl.text));
	const dialogue = clone(ass.dialogue);
	const comment = clone(ass.dialogue);
	dialogue.value.Start = msToAss(startMs - 900 < 0 ? 0 : startMs - 900);
	comment.value.Start = msToAss(startMs);
	dialogue.value.End = msToAss(stopMs);
	comment.value.End = msToAss(stopMs);
	dialogue.value.Text = '{\\k'+(startMs - 900 < 0 ? (900-startMs)/10 : 100) + ass.dialogueScript + ASSLine.join('');
	dialogue.value.Effect = 'fx';
	dialogue.value.Style = duet
		? styles.body[2].value.Name
		: styles.body[1].value.Name;
	comment.value.Text = ASSLine.join('');
	comment.value.Effect = 'karaoke';
	comment.key = 'Comment';
	comment.value.Style = duet
		? styles.body[2].value.Name
		: styles.body[1].value.Name;
	return {
		dialogue,
		comment
	};
}

function sortStartTime(a: any, b: any) {
	if (a.value.Start < b.value.Start) return -1;
	if (a.value.Start > b.value.Start) return 1;
	return 0;
}

/** Convert Ultrastar data (txt) to ASS */
export function convertToASS(time: string, options: SyllabesConfig): string {
	const ultrastar = new UltrastarParser(options);
	const kara = ultrastar.parse(time);
	const dialogues = [];
	const comments = [];
	const styles = clone(ass.styles);
	if (kara.meta.duet) {
		styles.body[1].value.Name = kara.meta.duetsingerp1 || 'Default';
		styles.body.push(clone(styles.body[1]));
		styles.body[2].value.Name = kara.meta.duetsingerp2 || 'Default2';
		styles.body[2].value.SecondaryColour = '&H000F4BE1';
	}
	const script = clone(ass.dialogue);
	script.value.Effect = ass.scriptFX;
	script.value.Text = ass.script;
	script.key = 'Comment';
	comments.push(script);
	for (const line of kara.track) {
		const ASSLines = generateASSLine(line, styles, false);
		comments.push(clone(ASSLines.comment));
		dialogues.push(clone(ASSLines.dialogue));
	}
	if (kara.meta.duet) {
		for (const line of kara.track_duet) {
			const ASSLines = generateASSLine(line, styles, true);
			comments.push(clone(ASSLines.comment));
			dialogues.push(clone(ASSLines.dialogue));
		}
	}
	comments.sort(sortStartTime);
	dialogues.sort(sortStartTime);
	const events = clone(ass.events);
	events.body = events.body.concat(comments, dialogues);
	return stringify([ass.scriptInfo, styles, events]);
}

async function mainCLI() {
	if (!process.argv[2]) {
		throw `Ultrastar2ass - Convert Ultrastar karaoke to ASS file
		Usage: ultrastar2ass myfile.txt
		Output goes to stdout
		`;
	}
	const txtFile = process.argv[2];

	if (!await asyncExists(txtFile)) throw `File ${txtFile} does not exist`;
	const txt = await asyncReadFile(txtFile, 'utf8');
	return convertToASS(txt, {syllable_precision: true});
}

if (require.main === module) mainCLI()
	.then(data => console.log(data))
	.catch(err => console.log(err));
