## Constants ##
CHORD_KEYS = {
	"C": 0,
	"Cm": 0,
	"C#": 1,
	"C#m": 1,
	"D": 2,
	"Dm": 2,
	"Eb": 3,
	"Ebm": 3,
	"E": 4,
	"Em": 4,
	"F": 5,
	"Fm": 5,
	"F#": 6,
	"F#m": 6,
	"G": 7,
	"Gm": 7,
	"Ab": 8,
	"Abm": 8,
	"A": 9,
	"Am": 9,
	"Bb": 10,
	"Bbm": 10,
	"B": 11,
	"Bm": 11
}

CHORD_MODES = {
	"C": 1,
	"Cm": 0,
	"C#": 1,
	"C#m": 0,
	"D": 1,
	"Dm": 0,
	"Eb": 1,
	"Ebm": 0,
	"E": 1,
	"Em": 0,
	"F": 1,
	"Fm": 0,
	"F#": 1,
	"F#m": 0,
	"G": 1,
	"Gm": 0,
	"Ab": 1,
	"Abm": 0,
	"A": 1,
	"Am": 0,
	"Bb": 1,
	"Bbm": 0,
	"B": 1,
	"Bm": 0
}

NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]



## Normalisation ##
def normaliseList(values):
	high = max(values)
	low = min(values)
	divisor = max([abs(high), abs(low)])
	
	return [float(value) / divisor for value in values]


## Formatting ##
def formatList(values, header):
	formatted = []
	formatted.append(header)
	
	for value in values:
		formatted.append([value])
	
	return formatted



## Timbre ##
def formatMFCC(values, limit):
	formatted = []
	
	header = [u"{}{}".format(u"MFCC", i) for i in range(1, limit + 1)]
	formatted.append(header)
	
	for i in range(0, len(values)):
		formatted.append(values[i][1 : limit + 1])
	
	return formatted


def formatZC(values):
	return formatList(values, [u"ZC"])



# Rhythm
def formatTimes(values):
	return formatList(values, [u"time"])



## Harmony ##
def formatChords(values):
	formatted = []
	
	header = [u"chordName", u"chordKey", u"chordMode"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		name = values[i]
		key = CHORD_KEYS.get(name, 0)
		mode = CHORD_MODES.get(name, 0)
		
		formatted.append([name, key, mode])
	
	return formatted


def formatNotes(values):
	formatted = []
	
	header = [u"noteName", u"noteMIDI", u"noteKey", u"nodeOctave"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		midi = values[i]
		octave = (midi / 12) - 1
		key = midi % 12
		name = NOTE_NAMES[key]
		
		formatted.append([name, midi, key, octave])
	
	return formatted



## Intensity ##
def formatRMS(values):
	return formatList(values, [u"RMS"])