export const scriptInfo = {
	section: 'Script Info',
	body: [
		{
			type: 'comment',
			value: 'Converted using ultrastar2ass : https://lab.shelter.moe/axelterizaki/ultrastar2ass'
		},
		{
			key: 'Title',
			value: ''
		},
		{
			key: 'ScriptType',
			value: 'v4.00+'
		},
		{
			key: 'WrapStyle',
			value: 0
		},
		{
			key: 'ScaledBorderAndShadow',
			value: 'yes'
		},
		{
			key: 'Collisions',
			value: 'Normal'
		}
	]
};

export const styles = {
	section: 'V4+ Styles',
	body: [
		{
			key: 'Format',
			value: [
				'Name',
				'Fontname',
				'Fontsize',
				'PrimaryColour',
				'SecondaryColour',
				'OutlineColour',
				'BackColour',
				'Bold',
				'Italic',
				'Underline',
				'StrikeOut',
				'ScaleX',
				'ScaleY',
				'Spacing',
				'Angle',
				'BorderStyle',
				'Outline',
				'Shadow',
				'Alignment',
				'MarginL',
				'MarginR',
				'MarginV',
				'Encoding'
			]
		},
		{
			key: 'Style',
			value: {
				'Name': 'Default',
				'Fontname': 'Arial',
				'Fontsize': '24',
				'PrimaryColour': '&H00FFFFFF',
				'SecondaryColour': '&H000088EF',
				'OutlineColour': '&H00000000',
				'BackColour': '&H00666666',
				'Bold': '-1',
				'Italic': '0',
				'Underline': '0',
				'StrikeOut': '0',
				'ScaleX': '100',
				'ScaleY': '100',
				'Spacing': '0',
				'Angle': '0',
				'BorderStyle': '1',
				'Outline': '1.5',
				'Shadow': '0',
				'Alignment': '8',
				'MarginL': '10',
				'MarginR': '10',
				'MarginV': '10',
				'Encoding': '1'
			}
		}
	]
};

export const events = {
	section: 'Events',
	body: [
		{
        	key: 'Format',
			'value': [
				'Layer',
				'Start',
				'End',
				'Style',
				'Name',
				'MarginL',
				'MarginR',
				'MarginV',
				'Effect',
				'Text'
			]
		}
	]
};

export const dialogue = {
	key: 'Dialogue',
	value: {
		Layer: '1',
		Start: '00:00:00.00',
		End: '00:00:00.00',
		Style: 'Default',
		Name: '',
		MarginL: '0',
		MarginR: '0',
		MarginV: '0',
		Effect: '',
		Text: ''
	}
};

export const dialogueScript = '\\fad(300,200)}';
export const scriptFX = 'template pre-line all keeptags';
export const script = '!retime("line",$start < 900 and -$start or -900,200)!{!$start < 900 and "\\\\k" .. ($start/10) or "\\\\k0"!\\fad(!$start < 900 and $start or 300!,200)}';
