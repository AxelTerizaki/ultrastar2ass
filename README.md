# Ultrastar2ASS

This is a converter for Ultrastar karaoke format to ASS, written in nodeJS.

## History

Ultrastar is a popular open karaoke game, and has a wide variety of syllable-timed karaokes.

These karaokes can now be converted to ASS easily and implemented in projects like [Karaoke Mugen](http://karaokes.moe)

Ultrastar2ASS uses code from [SyllableJS](https://github.com/komanaki/syllabesjs). I couldn't include the module properly and didn't need everything from it, so I just handpicked the Ultrastar code and fixed a thing or two on it.

## Installation

Run `npm install -g ultrastar2ass` to install as a global module (and get the CLI version)

Run `npm install ultrastar2ass` to install as a module for your project.

## Usage

### Module

As a module here's the method to use it :

#### convertToASS(txt: string, options: {object})

Returns a correctly formatted ASS file as a string. You need to provide the contents of the ultrastar TXT file as the first parameter and options as the second one.

Options are valide SyllableJS options :

```JS
{
  syllable_precision: boolean,
  offset: number
  start_as_previous_end: boolean
}
```

You might want to set `syllable_precision` to `true` to get syllable-timed karaoke instead of sentence-timed karaoke

### CLI

The CLI version is used as follows :

```sh
ultrastar2ass myfile.txt
```

It produces an ASS file on stdout.

## Build

If you wish to build from source, use `npm run-script build` to get standard JS in the `dist` folder.

## Test

You can test code with the `txt` file included in the test directory :

```sh
node dist/index.js test/jojo.txt
```

## License

MIT
