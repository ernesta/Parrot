import pylast
import secrets



def getThumb(artist, album):
	try:
		network = pylast.LastFMNetwork(api_key = secrets.LAST_FM_KEY, api_secret = secrets.LAST_FM_SECRET)
		API = network.get_album(artist, album)
		return API.get_cover_image(pylast.COVER_MEDIUM)
	except:
		return ""