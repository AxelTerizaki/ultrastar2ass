import { SyllabesConfig } from './types';

export default class UltrastarParser {

	config: SyllabesConfig;
	meta: any;
	track: any;
	track_duet: any;
	first_pass: boolean; // only to keep track of first pass if we have a spitted start time with the first sentence found

	constructor(config: SyllabesConfig) {
		this.config = config;
        
		this.meta = {
			title: null,
			artist: null,
			mp3: null,
			bpm: null,
			gap: 0,
			duet: false
		};
		this.track = [];
		this.track_duet = [];
		this.first_pass = true;
	}

	/**
	 * Parse an Ultrastar text file
	 * @param {string} file Ultrastar text file content
	 */
	parse(file: string) {

		// Let's parse the file line by line
		var lines = file.replace(/\r+/g, '').split('\n');

		var sentenceID = 1;			// Current sentence ID
		var trackID = 1;			// Current track ID
		var relative = false;		// Relative or absolute beats notation for the syllables
		var beatsCount = 0;			// Count of the elapsed beats
		var beatDuration = null;	// Duration of a beat (milliseconds)
		var currentStart = null;	// Start of the current sentence (milliseconds)
		var previousEnd = null;		// End of the previous sentence (milliseconds)
		var syllables = [];			// Syllables list of the current sentence

		// Parse each line of the file until the end (or a "E" line)
		for (var i = 0; i < lines.length; i++) {
			// Delete the trailing spaces
			var line = lines[i].replace(/^\s*/, '');

			// Ignore the line if it's empty
			if (line.replace(/\s*/g, '').length == 0) {
				continue;
			}

			// Metadata line
			if (line[0] == '#') {
				// Regex parsing of the line
				var matches = line.match(/(\w+):(.+)/);

				// Ignore the line if it's invalid
				if (matches == null || matches.length == 0) {
					continue;
				}

				// Split of the regex result
				matches = matches[0].split(':');

				var keyword: string = matches[0].toLowerCase();
				var value: any = matches[1];

				// Float conversion of the BPM / GAP
				if (keyword == 'bpm' || keyword == 'gap') {
					value = parseFloat(value.replace(',', '.'));
				}

				// Beat duration calculation from the BPM
				if (keyword == 'bpm') {
					// multiple by 4 because a bpm in ultrastar is in fact a quarter beat
					beatDuration = (60000) / (value * 4);
				}

				// Override the config offset if absent, and set the first sentence start as the GAP value
				if (keyword == 'gap') {
					if (this.config.offset) {
						value += this.config.offset;
					}
					currentStart = value;
				}

				// Mark the syllables beat notation as relative
				if (keyword == 'relative' && value.toLowerCase() == 'yes') {
					relative = true;
				}

				// Save the data if it isn't empty
				if (value != '') {
					this.meta[keyword] = value;
				}

				continue;
			}

			// Player change or end of file when a sentence isn't finished
			if ((line == 'P2' || line == 'P 2' || line[0] == 'E') && syllables.length > 0) {

				// Create a new sentence
				var sentence = this.makeSentence(sentenceID, syllables, currentStart, null, previousEnd);

				if (currentStart != null) {
					currentStart = null;
				}

				// Add the sentence to the current track
				if (trackID == 1) {
					this.track.push(sentence);
				} else {
					this.track_duet.push(sentence);
				}

				// Increment the sentence ID, reset the current sentence syllables
				sentenceID++;
				syllables = [];
			}

			// Lyrics player change
			if (line == 'P2' || line == 'P 2') {
				trackID = 2;
				this.meta.duet = true;
				continue;
			}

			// Syllable line
			if ([':', '*', 'F', 'R', 'G'].indexOf(line[0]) > -1) {
				// Regex parsing of the line
				var matches = line.match(/^[:*FRG] (-?\d+) (\d+) (-?\d+) (.+)/);

				// Ignore the line if it's invalid
				if (matches == null || matches.length == 0) {
					continue;
				}

				var syllable: any = {
					type: 'normal'
				};

				// Get the syllable text
				syllable.text = matches[0].split(' ').splice(4).join(' ');

				// Split of the regex result
				matches = matches[0].split(' ').splice(1, 3);

				// Add the start time of the syllable, with absolute or relative beats
				if (!relative) {
					syllable.start = Math.floor(this.meta.gap + parseInt(matches[0]) * beatDuration);
				} else {
					syllable.start = Math.floor(this.meta.gap + (beatsCount + parseInt(matches[0])) * beatDuration);
				}

				var matchesAfter = lines[i+1].replace(/^\s*/, '').match(/^[:*F-] (-?\d+)/);
				// Add the duration, end time, pitch
				syllable.duration = Math.floor((matchesAfter ? (parseInt(matchesAfter[1])- parseInt(matches[0])) : parseInt(matches[1])) * beatDuration);
				syllable.end = syllable.start + syllable.duration;
				syllable.pitch = parseInt(matches[2]);

				// Fix the first syllable start if the offset is negative
				if (this.meta.gap < 0 && syllable.start < 0) {
					syllable.start = 0;
					syllable.duration = syllable.end;
				}

				// Change the type for special syllables
				if (line[0] == '*' || line[0] == 'G') {
					syllable.type = 'golden';
				} else if (line[0] == 'F') {
					syllable.type = 'freestyle';
				} else if (line[0] == 'R') {
					syllable.type = 'rap';
				}

				// Increment the total beats count with the syllable beats
				beatsCount += parseInt(matches[1]);

				// Add the syllable
				syllables.push(syllable);
			}

			// New line mark
			if (line[0].indexOf('-') > -1) {
				// Regex parsing of the line
				var matches = line.match(/^- ?(\d+)\s?(\d+)?/);

				// Ignore the line if it's invalid
				if (matches == null || matches.length == 0) {
					continue;
				}

				// Split of the regex result
				matches = matches[0].split(' ');
				if (matches[0].length > 1) {
					matches[0] = matches[0].substr(1, matches[0].length);
				} else {
					matches = matches.splice(1);
				}
				var currentEnd = null;

				// Add the end time of the sentence, with absolute or relative beats
				if (!relative) {
					currentEnd = Math.floor(this.meta.gap + parseInt(matches[0]) * beatDuration);
				} else {
					currentEnd = Math.floor(this.meta.gap + (beatsCount + parseInt(matches[0])) * beatDuration);
				}

				// Fix the first sentence start if the offset is negative
				if (this.meta.gap < 0 && currentStart < 0) {
					currentStart = 0;
				} else if(null !== currentStart && (0 < syllables.length) && this.first_pass) { // we may need an additional offset - just move to the very first part if we have one
					currentStart = Math.max(currentStart, syllables[0].start);
				}
                
				// Create a new sentence
				var sentence = this.makeSentence(sentenceID, syllables, currentStart, currentEnd, previousEnd);

				if (currentStart != null) {
					currentStart = null;
				}

				// Save the sentence end time for possible use on the next sentence
				previousEnd = sentence.end;

				// Save the start time of the next sentence if it's present on the line, with absolute or relative beats
				if (matches[1]) {
					if (!relative) {
						currentStart = Math.floor((this.config.offset ? this.config.offset : 0) + this.meta.gap + parseInt(matches[1]) * beatDuration);
						beatsCount = parseInt(matches[1]);
					} else {
						currentStart = Math.floor((this.config.offset ? this.config.offset : 0) + this.meta.gap + (beatsCount + parseInt(matches[1])) * beatDuration);
						beatsCount += parseInt(matches[1]);
					}
				} // now, we *MAY* have computed the first offset : we do not need to keep this, ever
				this.first_pass = false;

				// Add the sentence to the current track
				if (trackID == 1) {
					this.track.push(sentence);
				} else {
					this.track_duet.push(sentence);
				}

				// Increment the sentence ID, reset the current sentence syllables
				sentenceID++;
				syllables = [];
			}

			// End of file
			if (line[0] == 'E') {
				break;
			}
		}

		return {
			meta: this.meta,
			track: this.track,
			track_duet: (this.track_duet.length > 0) ? this.track_duet : null
		};
	}

	/**
	 * Make a new sentence
	 * @param {number} id          ID of the sentence
	 * @param {any[]}  syllables   Syllables list of the sentence
	 * @param {number} start       Start time of the sentence
	 * @param {number} end         End time of the sentence
	 * @param {number} previousEnd End time of the previous sentence
	 */
	private makeSentence(id: number, syllables: any[], start: number, end: number, previousEnd: number) {
		var sentence: any = {
			id: id,
			start: syllables[0].start,
			end: syllables[syllables.length - 1].end
		};

		// Insert sentence syllables as objects or as a string
		if (this.config.syllable_precision) {
			sentence.syllables = syllables;
		} else {
			sentence.text = '';
			for (var j = 0; j < syllables.length; j++) {
				sentence.text += syllables[j].text;
			}
		}

		// Add the start of the sentence if it was present on the last "sentence end" line
		if (start != null) {
			sentence.start = start;
		} else if (previousEnd != null && this.config.start_as_previous_end) {
			sentence.start = previousEnd;
		}

		// Add the end of the sentence if any
		if (end != null) {
			sentence.end = end;
		}

		// Set the duration with start and end
		sentence.duration = sentence.end - sentence.start;
        
		return sentence;
	}
}