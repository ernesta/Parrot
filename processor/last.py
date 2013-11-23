import pylast
import secrets



def getThumb(artist, album):
	network = pylast.LastFMNetwork(api_key = secrets.LAST_FM_KEY, api_secret = LAST_FM_SECRET)
	
	API = network.get_album(artist, album)
	thumb = API.get_cover_image(pylast.COVER_MEDIUM)
	
	return thumb