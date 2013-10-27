## Constants ##
CHORDS = {
	"C": {"notes": [1,0,0,0,1,0,0,1,0,0,0,0], "key": 0, "mode": 1},
	"Cm": {"notes": [1,0,0,1,0,0,0,1,0,0,0,0], "key": 0, "mode": 0},
	"C#": {"notes": [0,1,0,0,0,1,0,0,1,0,0,0], "key": 1, "mode": 1},
	"C#m": {"notes": [0,1,0,0,1,0,0,0,1,0,0,0], "key": 1, "mode": 0},
	"D": {"notes": [0,0,1,0,0,0,1,0,0,1,0,0], "key": 2, "mode": 1},
	"Dm": {"notes": [0,0,1,0,0,1,0,0,0,1,0,0], "key": 2, "mode": 0},
	"Eb": {"notes": [0,0,0,1,0,0,0,1,0,0,1,0], "key": 3, "mode": 1},
	"Ebm": {"notes": [0,0,0,1,0,0,1,0,0,0,1,0], "key": 3, "mode": 0},
	"E": {"notes": [0,0,0,0,1,0,0,0,1,0,0,1], "key": 4, "mode": 1},
	"Em": {"notes": [0,0,0,0,1,0,0,1,0,0,0,1], "key": 4, "mode": 0},
	"F": {"notes": [1,0,0,0,0,1,0,0,0,1,0,0], "key": 5, "mode": 1},
	"Fm": {"notes": [1,0,0,0,0,1,0,0,1,0,0,0], "key": 5, "mode": 0},
	"F#": {"notes": [0,1,0,0,0,0,1,0,0,0,1,0], "key": 6, "mode": 1},
	"F#m": {"notes": [0,1,0,0,0,0,1,0,0,1,0,0], "key": 6, "mode": 0},
	"G": {"notes": [0,0,1,0,0,0,0,1,0,0,0,1], "key": 7, "mode": 1},
	"Gm": {"notes": [0,0,1,0,0,0,0,1,0,0,1,0], "key": 7, "mode": 0},
	"Ab": {"notes": [1,0,0,1,0,0,0,0,1,0,0,0], "key": 8, "mode": 1},
	"Abm": {"notes": [0,0,0,1,0,0,0,0,1,0,0,1], "key": 8, "mode": 0},
	"A": {"notes": [0,1,0,0,1,0,0,0,0,1,0,0], "key": 9, "mode": 1},
	"Am": {"notes": [1,0,0,0,1,0,0,0,0,1,0,0], "key": 9, "mode": 0},
	"Bb": {"notes": [0,0,1,0,0,1,0,0,0,0,1,0], "key": 10, "mode": 1},
	"Bbm": {"notes": [0,1,0,0,0,1,0,0,0,0,1,0], "key": 10, "mode": 0},
	"B": {"notes": [0,0,0,1,0,0,1,0,0,0,0,1], "key": 11, "mode": 1},
	"Bm": {"notes": [0,0,1,0,0,0,1,0,0,0,0,1], "key": 11, "mode": 0}}

NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]



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
	
	header = [u"chordName", u"chordKey", u"chordMode", u"chordNotes"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		name = values[i]
		chord = CHORDS.get(name)
		
		formatted.append([name, chord.get("key"), chord.get("mode"), chord.get("notes")])
	
	return formatted


def formatNotes(values):
	formatted = []
	
	header = [u"noteName", u"noteMIDI", u"noteKey", u"nodeOctave"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		midi = values[i]
		octave = (midi / 12) - 1
		key = midi % 12
		name = NOTES[key]
		
		formatted.append([name, midi, key, octave])
	
	return formatted



## Intensity ##
def formatRMS(values):
	return formatList(values, [u"RMS"])