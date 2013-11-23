import extractor
import metadata
import os
import utils



## Constants ##
SCRIPTS, SCRIPT = os.path.split(os.path.abspath(__file__))
DATA = u"{}/../data".format(SCRIPTS)
INPUT = u"{}/input".format(DATA)
OUTPUT = u"{}/output".format(DATA)
TRACKS = u"{}/tracks".format(DATA)



def loadMetadata(path):
	try:
		return metadata.load(path)
	except IOError:
		print(u"Cannot load {}.".format(path))
		return None


def displaySummary(meta):
	summary = metadata.getSummary(meta)
	utils.printToConsole(summary)


def createDirectory(meta):
	hash = utils.getHash(metadata.getArtist(meta) + metadata.getTitle(meta))
	directory = u"{}/{}".format(OUTPUT, hash)
	utils.createDirectory(directory)
	
	return directory


def getBasicMetadata(meta):
	artist = metadata.getTitle(meta)
	title = metadata.getArtist(meta)
	hash = utils.getHash(artist + title)
	
	thumb = last.getThumb(artist, metadata.getAlbum(meta))
	
	return {
		u"artist": artist,
		u"title": title,
		u"directory": u"{}/".format(hash),
		u"thumb": thumb
	}



## Flow ##
tracks = []

for filename in utils.readListFromFile(u"{}.txt".format(TRACKS)):
	# Loads the track for MIR and metadata extraction
	path = u"{}/{}".format(INPUT, filename.decode("utf-8"))
	
	# Loads the track's metadata
	meta = loadMetadata(path)
	# Displays the file's metadata in the console window
	displaySummary(meta)
	
	# Creates a directory for storing feature data
	directory = createDirectory(meta)
	print(directory.split("/")[-1])
	
	# Extracts metadata for saving in tracks.json
	track = getBasicMetadata(meta)
	tracks.append(track)
	
	
	# Extracts local and Echo Nest feature information
	extractor.extractLocalFeatures(directory, path)
	extractor.extractEchoFeatures(directory, path, meta)

utils.writeJSON(tracks, u"{}.json".format(TRACKS))