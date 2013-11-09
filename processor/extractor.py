import metadata
import mir
import nest
import utils


## Local ##
def extractLocalFeatures(directory, path):
	input = []
	
	# Preparation
	audio = mir.load(path)
	onsets, frames, times, spectra = prepareInputs(audio)
	
	# Timbre
	input.append(mir.getCleanMFCC(spectra))
	input.append(mir.getCleanZC(frames))
	
	# Rhythm
	input.append(mir.getCleanTimes(times))
	
	# Harmony
	input.append(mir.getCleanNotes(spectra))
	input.append(mir.getCleanChords(spectra))
	
	# Loudness
	input.append(mir.getCleanRMS(frames))
	
	features = utils.combineLists(input)
	filename = u"{}/{}".format(directory, u"features.tsv")
	utils.writeData(features, filename)


def prepareInputs(audio):
	onsets = mir.getFluxOnsets(audio)
	frames = mir.getOnsetFrames(audio, onsets)
	times = mir.getTimes(frames)
	spectra = mir.getSpectra(frames)
	
	return onsets, frames, times, spectra



## Echo Nest ##
def extractEchoFeatures(directory, path, meta):
	echo = nest.initialize()
	
	# Retrieves Echo Nest summary
	summary = nest.retrieveSummary(echo, path)
	
	# Retrieves Echo Nest analysis
	URL = summary[u"analysis_url"]
	analysis = nest.retrieveAnalysis(URL)
	
	# Writes summary data
	meta = getSummaryMetadata(meta)
	summary = nest.getCleanSummary(summary, analysis, meta, path)
	
	filename = u"{}/{}".format(directory, u"info.json")
	utils.writeJSON(summary, filename)
	
	# Writes analysis data
	analysis = nest.getCleanAnalysis(analysis)
	for key, value in analysis.items():
		filename = u"{}/{}".format(directory, key)
		utils.writeData(value, u"{}.tsv".format(filename))


def getSummaryMetadata(meta):
	return {
		u"artist": metadata.getArtist(meta),
		u"title": metadata.getTitle(meta),
		u"album": metadata.getAlbum(meta),
		u"year": metadata.getYear(meta)
	}