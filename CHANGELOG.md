# CHANGELOG

## 1.1.3

- Update default style

## 1.1.2

- Removed encoding checks to allow more weird encoding methods.

## 1.1.0

- Added `--encoding=` option to specify encoding output for the ASS files (thanks @louisroyer )

## 1.0.24

- Do not try to make sentence without syllabes

## 1.0.23

- Update margins for style

## 1.0.22

- Fix rap lines conversion

## 1.0.21

- Fix carriage return for linux

## 1.0.20

- Fix wrong condition for whitespace at end of syllable

## 1.0.19

- Re-add whitespace at end of syllable

## 1.0.18

- Add whitespace before duration instead of after

## 1.0.17

- Remove use of New line mark end, better start sentence without

## 1.0.16

- Fix New line mark when start and end are different

## 1.0.15

- Add note type 'R' (rap) and 'G' (golden) support

## 1.0.13

- Fixed some cases where the ultrastar lyrics file was malformed. Something the original game permits but we didn't (thanks @Aeden)

## 1.0.12

- Fixed syllable duration for good (thanks @Aeden)

## 1.0.11

- No changes, forgot to tsc --build before npm publish

## 1.0.10

- Thanks to @Aeden, many fixes have been made to the conversion

## 1.0.9

- Fixed \k100 to \k90, not on comment lines anymore
- Fixed hours being on one character instead of two
- Fixed fad+k effect on beginning of line.

## 1.0.8

- Fixed default font and color
- Fixed karaoke and comment inversion for fx

## 1.0.7

- Fix function types

## 1.0.6

- Forgot to include dist/

## 1.0.5

- First NPM version

## 1.0.4

- Fix \k90 ASS tag not suitable for a 1000ms delay (my bad)
- Starting time for first line in a duet is now set correctly (thanks @Lpu8er)
- Added duet sample karaoke in test/
- Handled negative beat numbers

## 1.0.3

- Fix first comment being left out as a dialogue (the one with the ASS script)

## 1.0.2

- Dialogues are now copied as comments without the \fad ASS effect so you can properly edit it in Aegisub if you need to.

## 1.0.1

- Removed test file variable

## 1.0.0

- Initial version

