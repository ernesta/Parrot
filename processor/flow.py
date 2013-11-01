import metadata
import mir
import nest
import utils
import os



## Constants ##
SCRIPTS, SCRIPT = os.path.split(os.path.abspath(__file__))
DATA = u"{}/../data".format(SCRIPTS)
SAMPLES = u"{}/samples".format(DATA)
INPUT = u"{}/input".format(DATA)
OUTPUT = u"{}/output".format(DATA)
INFO = u"info"

FILENAME = u"{}/{}"

FEATURES = u"features"
MFCC = u"MFCC"
ZC = u"ZC"
TIMES = u"times"
NOTES = u"notes"
CHORDS = u"chords"
RMS = u"RMS"

	
	
## MIR ##
def prepareInputs(audio):
	onsets = mir.getFluxOnsets(audio)
	frames = mir.getOnsetFrames(audio, onsets)
	times = mir.getTimes(frames)
	spectra = mir.getSpectra(frames)
	
	return onsets, frames, times, spectra
	

def extractAllFeatures(directory, audio):
	# Preparation
	onsets, frames, times, spectra = prepareInputs(audio)
	
	# Timbre
	mfcc = mir.getCleanMFCC(spectra)
	zc = mir.getCleanZeroCrossings(frames)
	
	# Rhythm
	times = mir.getCleanTimes(times)
	
	# Harmony
	notes = mir.getCleanNotes(spectra)
	chords = mir.getCleanChords(spectra)
	
	# Intensity
	rms = mir.getCleanRMS(frames)
	
	features = utils.combineLists([times, mfcc, zc, notes, chords, rms])
	filename = FILENAME.format(directory, FEATURES)
	utils.writeData(features, filename)


def extractIndividualFeatures(directory, audio):
	# Preparation
	onsets, frames, times, spectra = prepareInputs(audio)
	
	# Timbre
	extractFeature(MFCC, times, spectra, directory)
	extractFeature(ZC, times, frames, directory)
	
	# Rhythm
	extractFeature(TIMES, times, times, directory)
	
	# Harmony
	extractFeature(NOTES, times, spectra, directory)
	extractFeature(CHORDS, times, spectra, directory)
	
	# Intensity
	extractFeature(RMS, times, frames, directory)


def extractFeature(feature, indices, values, directory):
	filename = FILENAME.format(directory, feature)
	
	{
		MFCC: lambda i, v, f: utils.writeData(utils.combineLists([mir.getCleanTimes(i), mir.getCleanMFCC(v)]), f),
		ZC: lambda i, v, f: utils.writeData(utils.combineLists([mir.getCleanTimes(i), mir.getCleanZeroCrossings(v)]), f),
		TIMES: lambda i, v, f: utils.writeData(mir.getCleanTimes(i), f),
		NOTES: lambda i, v, f: utils.writeData(utils.combineLists([mir.getCleanTimes(i), mir.getCleanNotes(v)]), f),
		CHORDS: lambda i, v, f: utils.writeData(utils.combineLists([mir.getCleanTimes(i), mir.getCleanChords(v)]), f),
		RMS: lambda i, v, f: utils.writeData(utils.combineLists([mir.getCleanTimes(i), mir.getCleanRMS(v)]), f),
	}[feature](indices, values, filename)


def extractEchoFeatures(directory, path):
	echo = nest.initialize()
	echoSummary = nest.retrieveSummary(echo, path)
	echoAnalysis = nest.retrieveAnalysis(echoSummary["analysis_url"])
	
	formattedSummary = nest.getCleanSummary(echoSummary, echoAnalysis, path)
	formattedAnalysis = nest.getCleanAnalysis(echoAnalysis)
	
	# Writes feature data
	for key, value in formattedAnalysis.items():
		filename = FILENAME.format(directory, key)
		utils.writeData(value, filename)
	
	# Writes summary data
	filename = FILENAME.format(directory, INFO)
	utils.writeJSON(formattedSummary, filename)



## Flow ##
samples = []

for filename in utils.loadListFromFile("{}.txt".format(SAMPLES)):
	# Loads the file for MIR and metadata extraction
	path = FILENAME.format(INPUT, filename)
	
	try:
		meta = metadata.load(path)
		audio = mir.load(path)
	except IOError:
		print(u"Cannot load {}.".format(path))
	
	# Displays the file's metadata in the console window
	summary = metadata.getSummary(meta)
	utils.printToConsole(summary)
	
	# Creates a directory for storing audio data
	ID = utils.getHash(metadata.getArtist(meta) + metadata.getTitle(meta))
	directory = FILENAME.format(OUTPUT, ID)
	utils.createDirectory(directory)
	
	# Extracts metadata for saving in samples.json
	samples.append({
		"title": metadata.getTitle(meta),
		"artist": metadata.getArtist(meta),
		"directory": u"{}/".format(ID)
	})
	
	# Extracts feature information
#	extractIndividualFeatures(directory, audio)
	extractAllFeatures(directory, audio)
	
	# Extracts Echo Nest feature information
	extractEchoFeatures(directory, path)

utils.writeJSON(samples, SAMPLES)