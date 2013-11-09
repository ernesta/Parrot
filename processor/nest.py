import formatter
import json
import pyen
import secrets
import time
import urllib2



## Constants ##
READ = u"rb"



def initialize():
	return pyen.Pyen(secrets.ECHO_NEST_KEY)


def retrieveSummary(echo, path):
	with open(path, READ) as file:
		response = echo.post(u"track/upload", track = file, filetype = u"mp3")
		id = response[u"track"][u"id"]
		
		return retrievePendingSummary(echo, id)


def retrievePendingSummary(echo, id):
	while True:
		response = echo.get(u"track/profile", id = id, bucket = [u"audio_summary"])
		if response[u"track"][u"status"] <> u"pending":
			break
		time.sleep(1)
	
	return response[u"track"][u"audio_summary"]


def retrieveAnalysis(URL):
	response = urllib2.urlopen(URL)
	
	return json.load(response)


def getCleanSummary(summary, analysis, meta, path):
	cleanSummary = dict(summary)
	del cleanSummary[u"analysis_url"]
	
	cleanSummary[u"artist"] = meta[u"artist"]
	cleanSummary[u"title"] = meta[u"title"]
	cleanSummary[u"album"] = meta[u"album"]
	cleanSummary[u"year"] = meta[u"year"]
	cleanSummary[u"genre"] = analysis[u"meta"][u"genre"]
	cleanSummary[u"bitrate"] = analysis[u"meta"][u"bitrate"]
	cleanSummary[u"sample_rate"] = analysis[u"meta"][u"sample_rate"]
	cleanSummary[u"filename"] = path.split(u"/")[-1]
	
	return cleanSummary


def getCleanAnalysis(analysis):
	cleanAnalysis = dict(analysis)
	del cleanAnalysis[u"meta"]
	del cleanAnalysis[u"track"]
	del cleanAnalysis[u"tatums"]
	
	cleanAnalysis = formatter.formatAnalysis(cleanAnalysis)
	
	return cleanAnalysis