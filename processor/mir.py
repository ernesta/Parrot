import formatter
import numpy
from pymir import AudioFile
from pymir import Pitch
from pymir import Onsets
from pymir import Frame



## Constants ##
FRAME = pow(2, 14);
FILTERS = 40
DIMENSIONS = 6



## Init ##
def load(path):
	return AudioFile.open(path)



## Outputs ##
def getCleanMFCC(spectra):
	MFCC = getMFCC(spectra)
	MFCC = [formatter.normaliseList(coefficients) for coefficients in MFCC]
	MFCC = formatter.formatMFCC(MFCC, DIMENSIONS)
	
	return MFCC


def getCleanZeroCrossings(frames):
	zeroCrossings = getZeroCrossings(frames)
	zeroCrossings = formatter.normaliseList(zeroCrossings)
	zeroCrossings = formatter.formatZC(zeroCrossings)
	
	return zeroCrossings


def getCleanTimes(times):
	times = formatter.formatTimes(times)
	
	return times


def getCleanNotes(spectra):
	# Note names, keys (0 - 11), octaves (-1 - 9), and MIDI keys (0 - 127)
	notes = getNotes(spectra)
	notes = formatter.formatNotes(notes)
	
	return notes


def getCleanChords(spectra):
	# Chord names, keys (0 - 11) and modes (major, 1, and minor, 0)
	chords = getChords(spectra)
	chords = formatter.formatChords(chords)
	
	return chords


def getCleanRMS(frames):
	RMS = getRMS(frames)
	RMS = formatter.normaliseList(RMS)
	RMS = formatter.formatRMS(RMS)
	
	return RMS



## Inputs ##
def getOnsetFrames(audio, onsets):
	return audio.framesFromOnsets(onsets)


def getFixedFrames(audio, frameSize):
	window = numpy.hamming
	
	frames = audio.frames(frameSize, window)
	frames.pop()
	
	return frames


def getSpectra(frames):
	return [frame.spectrum() for frame in frames]


def getChroma(spectra):
	return [spectrum.chroma() for spectrum in spectra]


## Time ##
def getTimes(frames):
	times = []
	index = 0
	
	for frame in frames:
		time = float(index) / frame.sampleRate
		times.append(time)
		
		index += len(frame)
	
	return times
	


## Timbre ##
def getMFCC(spectra):
	return [spectrum.mfcc2(numFilters = FILTERS) for spectrum in spectra]


def getZeroCrossings(frames):
	return [frame.zcr() for frame in frames]



## Rhythm ##
def getFluxOnsets(audio):
	return Onsets.onsetsByFlux(audio)



## Harmony ##
def getNotes(spectra):
	return [Pitch.naivePitch(spectrum) for spectrum in spectra]


def getChords(spectra):
	chords = []
	
	for chromum in getChroma(spectra):
		chord, score = Pitch.getChord(chromum)
		chords.append(chord)
	
	return chords



## Intensity ##
def getRMS(frames):
	return [frame.rms() for frame in frames]



## Statistics ##
def getChordMood(chords):
	modes = [chord["mode"] for chord in chords]
	mood = float(sum(modes)) / len(modes)
	
	return mood