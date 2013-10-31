import formatter
import json
import pyen
import secrets
import time
import urllib2



def initialize():
	return pyen.Pyen(secrets.ECHO_NEST_KEY)


def retrieveSummary(echo, path):
	f = open(path, "rb")
	response = echo.post("track/upload", track = f, filetype = "mp3")
	id = response["track"]["id"]
	
	return retrievePendingSummary(echo, id)


def retrieveAnalysis(URL):
	response = urllib2.urlopen(URL)
	return json.load(response)


def retrievePendingSummary(echo, id):
	while True:
		response = echo.get("track/profile", id = id, bucket = ["audio_summary"])
		
		if response["track"]["status"] <> "pending":
			break
		time.sleep(1)
	
	return response["track"]["audio_summary"]


def getCleanSummary(summary, analysis):
	cleanSummary = dict(summary)
	del cleanSummary["analysis_url"]
	
	meta = analysis["meta"];
	
	cleanSummary["artist"] = meta["artist"]
	cleanSummary["album"] = meta["album"]
	cleanSummary["title"] = meta["title"]
	cleanSummary["genre"] = meta["genre"]
	cleanSummary["bitrate"] = meta["bitrate"]
	cleanSummary["sample_rate"] = meta["sample_rate"]
	
	return cleanSummary


def getCleanAnalysis(analysis):
	cleanAnalysis = dict(analysis)
	del cleanAnalysis["meta"]
	del cleanAnalysis["track"]
	del cleanAnalysis["tatums"]
	
	cleanAnalysis = formatter.formatAnalysis(cleanAnalysis)
	
	return cleanAnalysis