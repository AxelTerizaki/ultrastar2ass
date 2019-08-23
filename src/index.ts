#!/usr/bin/env node
import { asyncExists, asyncReadFile, clone, msToAss } from './utils';
import UltrastarParser from './ultrastar';
import stringify from 'ass-stringify';
import { SyllabesConfig } from './types';
const ass = require('./assTemplate');

/** Convert Ultrastar data (txt) to ASS */
export function convertToASS(time: string, options: SyllabesConfig): string {
	const ultrastar = new UltrastarParser(options);
	const kara = ultrastar.parse(time);
	const dialogues = [];
	const comments = [];
	const script = clone(ass.dialogue);
	script.value.Effect = ass.scriptFX;
	script.value.Text = ass.script;
	comments.push(script);
	for (const line of kara.track) {
		const ASSLine = [];
		let startMs = line.start - 1000;
		if (startMs < 0) startMs = 0;
		const stopMs = line.end + 100;
		line.syllables.forEach((syl: any) => ASSLine.push('{\\k' + Math.floor(syl.duration / 10) + '}' + syl.text));
		const dialogue = clone(ass.dialogue);
		const comment = clone(ass.dialogue);
		dialogue.value.Start = comment.value.Start = msToAss(startMs);
		dialogue.value.End = comment.value.End = msToAss(stopMs);
		dialogue.value.Text = ass.dialogueScript + ASSLine.join('');
		dialogue.value.Effect = 'karaoke';
		comment.value.Text = ass.commentScript + ASSLine.join('');
		comment.value.Effect = 'fx';
		comment.key = 'Comment';
		// Add it to our kara
		comments.push(clone(comment));
		dialogues.push(clone(dialogue));
	}
	const events = clone(ass.events);
	events.body = events.body.concat(comments, dialogues);
	return stringify([ass.scriptInfo, ass.styles, events]);
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
