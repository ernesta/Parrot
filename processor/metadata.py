import eyed3



## Init ##
def load(path):
	return eyed3.load(path)



## Accessors ##
def getTitle(audio):
	return audio.tag.title


def getArtist(audio):
	return audio.tag.artist


def getAlbum(audio):
	return audio.tag.album


def getYear(audio):
	return audio.tag.best_release_date.year


def getLength(audio):
	return audio.info.time_secs


def getSize(audio):
	return audio.info.size_bytes


def getBitrate(audio):
	varied, bitrate = audio.info.bit_rate
	
	return bitrate



## Prettifiers ##
def getPrettyLength(audio):
	return eyed3.utils.formatTime(getLength(audio))


def getPrettySize(audio):
	return eyed3.utils.formatSize(getSize(audio))


def getPrettyBitrate(audio):
	return audio.info.bit_rate_str



## Summary ##
def getSummary(audio):
	title = u"{} by {}".format(getTitle(audio), getArtist(audio))
	subtitle = u"{} ({})".format(getAlbum(audio), getYear(audio))
	
	time = getPrettyLength(audio)
	size = getPrettySize(audio)
	bitrate = getPrettyBitrate(audio)
	
	info = u"Time: {} | Size: {} | Bit rate: {}".format(time, size, bitrate)
	
	return [title, subtitle, info]