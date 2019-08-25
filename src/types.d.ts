export interface SyllabesConfig {
	offset?: number
	syllable_precision?: boolean
	start_as_previous_end?: boolean
}
export function convertToASS(time: string, options: SyllabesConfig): string

