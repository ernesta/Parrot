## Constants ##
CHORDS = {
	u"C": {u"chordNotes": [1,0,0,0,1,0,0,1,0,0,0,0], u"chordKey": 0, u"chordMode": 1},
	u"Cm": {u"chordNotes": [1,0,0,1,0,0,0,1,0,0,0,0], u"chordKey": 0, u"chordMode": 0},
	u"C#": {u"chordNotes": [0,1,0,0,0,1,0,0,1,0,0,0], u"chordKey": 1, u"chordMode": 1},
	u"C#m": {u"chordNotes": [0,1,0,0,1,0,0,0,1,0,0,0], u"chordKey": 1, u"chordMode": 0},
	u"D": {u"chordNotes": [0,0,1,0,0,0,1,0,0,1,0,0], u"chordKey": 2, u"chordMode": 1},
	u"Dm": {u"chordNotes": [0,0,1,0,0,1,0,0,0,1,0,0], u"chordKey": 2, u"chordMode": 0},
	u"Eb": {u"chordNotes": [0,0,0,1,0,0,0,1,0,0,1,0], u"chordKey": 3, u"chordMode": 1},
	u"Ebm": {u"chordNotes": [0,0,0,1,0,0,1,0,0,0,1,0], u"chordKey": 3, u"chordMode": 0},
	u"E": {u"chordNotes": [0,0,0,0,1,0,0,0,1,0,0,1], u"chordKey": 4, u"chordMode": 1},
	u"Em": {u"chordNotes": [0,0,0,0,1,0,0,1,0,0,0,1], u"chordKey": 4, u"chordMode": 0},
	u"F": {u"chordNotes": [1,0,0,0,0,1,0,0,0,1,0,0], u"chordKey": 5, u"chordMode": 1},
	u"Fm": {u"chordNotes": [1,0,0,0,0,1,0,0,1,0,0,0], u"chordKey": 5, u"chordMode": 0},
	u"F#": {u"chordNotes": [0,1,0,0,0,0,1,0,0,0,1,0], u"chordKey": 6, u"chordMode": 1},
	u"F#m": {u"chordNotes": [0,1,0,0,0,0,1,0,0,1,0,0], u"chordKey": 6, u"chordMode": 0},
	u"G": {u"chordNotes": [0,0,1,0,0,0,0,1,0,0,0,1], u"chordKey": 7, u"chordMode": 1},
	u"Gm": {u"chordNotes": [0,0,1,0,0,0,0,1,0,0,1,0], u"chordKey": 7, u"chordMode": 0},
	u"Ab": {u"chordNotes": [1,0,0,1,0,0,0,0,1,0,0,0], u"chordKey": 8, u"chordMode": 1},
	u"Abm": {u"chordNotes": [0,0,0,1,0,0,0,0,1,0,0,1], u"chordKey": 8, u"chordMode": 0},
	u"A": {u"chordNotes": [0,1,0,0,1,0,0,0,0,1,0,0], u"chordKey": 9, u"chordMode": 1},
	u"Am": {u"chordNotes": [1,0,0,0,1,0,0,0,0,1,0,0], u"chordKey": 9, u"chordMode": 0},
	u"Bb": {u"chordNotes": [0,0,1,0,0,1,0,0,0,0,1,0], u"chordKey": 10, u"chordMode": 1},
	u"Bbm": {u"chordNotes": [0,1,0,0,0,1,0,0,0,0,1,0], u"chordKey": 10, u"chordMode": 0},
	u"B": {u"chordNotes": [0,0,0,1,0,0,1,0,0,0,0,1], u"chordKey": 11, u"chordMode": 1},
	u"Bm": {u"chordNotes": [0,0,1,0,0,0,1,0,0,0,0,1], u"chordKey": 11, u"chordMode": 0}}

NOTES = [u"C", u"C#", u"D", u"D#", u"E", u"F", u"F#", u"G", u"G#", u"A", u"A#", u"B"]



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
	
	header = [u"MFCC"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		formatted.append([values[i][1 : limit + 1]])
	
	return formatted


def formatZC(values):
	return formatList(values, [u"ZC"])



# Rhythm
def formatTimes(values):
	return formatList(values, [u"time"])


def formatBeats(beats, bars):
	formatted = [[u"time", u"type"]]
	
	i = 0
	for j in range(0, len(beats)):
		beat = beats[j][u"start"]
		
		if (i < len(bars)) and (beat == bars[i][u"start"]):
			formatted.append([beat, 2])
			i = i + 1
		else:
			formatted.append([beat, 1])
	
	return formatted



## Harmony ##
def formatChords(values):
	formatted = []
	
	header = [u"chordName", u"chordKey", u"chordMode", u"chordNotes"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		name = values[i]
		chord = CHORDS[name]
		
		formatted.append([name, chord[u"chordKey"], chord[u"chordMode"], chord[u"chordNotes"]])
	
	return formatted


def formatNotes(values):
	formatted = []
	
	header = [u"noteName", u"noteMIDI", u"noteKey", u"noteOctave"]
	formatted.append(header)
	
	for i in range(0, len(values)):
		midi = values[i]
		octave = (midi / 12) - 1
		key = midi % 12
		name = NOTES[key]
		
		formatted.append([name, midi, key, octave])
	
	return formatted



## Loudness ##
def formatRMS(values):
	return formatList(values, [u"RMS"])



## Analysis ##
def formatAnalysis(values):
	beats = formatBeats(values[u"beats"], values[u"bars"])
	
	segments = [[u"time", u"chroma", u"timbre", u"dB"]]
	for value in values[u"segments"]:
		segments.append([value[u"start"], value[u"pitches"], value[u"timbre"], value[u"loudness_start"]])
	
	sections = [[u"time", u"loudness", u"tempo", u"key", u"mode"]]
	for value in values[u"sections"]:
		sections.append([value[u"start"], value[u"loudness"], value[u"tempo"], value[u"key"], value[u"mode"]])
	
	formatted = {
		u"beats": beats,
		u"segments": segments,
		u"sections": sections
	}
	
	return formatted