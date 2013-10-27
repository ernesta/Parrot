import csv
import codecs
import cStringIO
import hashlib
import os



## Constants ##
SEPARATOR = u"-" * 60
TAB = "\t"
UTF8 = "utf-8"
TSV = u".tsv"
READ = "rb"
WRITE = "wb"
INDEX = u"index"
VALUE = u"value"
FLOAT = u"{:.03f}"



## Console ##
def printToConsole(list):
	print(SEPARATOR)
	print(u"\n".join(list))
	print(SEPARATOR)



## Hashing ##
def getHash(message):
	md5 = hashlib.md5()
	md5.update(message.encode(UTF8))
	
	return md5.hexdigest()



## Combining ##
def combineLists(lists):
	combined = lists[0]
	
	for i in range(1, len(lists)):
		for j in range(0, len(lists[i])):
			combined[j] = combined[j] + lists[i][j]
	
	return combined



## Reading ##
def loadListFromFile(path):
	with open(path, READ) as file:
		rows = file.readlines()
		rows = map(lambda s: s.strip(), rows)
		
		return rows



## Writing ##
def createDirectory(path):
	if not os.path.exists(path):
		os.makedirs(path)


def writeData(data, filename):
	with open(filename + TSV, WRITE) as file:
		# Gets TSV writer
		writer = csv.writer(file, delimiter = TAB)
		
		# Writes the file's header
		writer.writerow(data[0])
		
		# Writes data
		for i in range(1, len(data)):
			row = []
			
			for j in range(0, len(data[i])):
				entry = data[i][j]
				
				if isinstance(entry, float):
					row.append(FLOAT.format(entry))
				else:
					row.append(entry)
			
			writer.writerow(row)


def writeText(text, filename):
	with open(filename + TSV, WRITE) as file:
		# Sets encoding header
		file.write(codecs.BOM_UTF8)
		# Gets CSV writer
		writer = UnicodeWriter(file)
		
		# Writes data
		for row in text:
			writer.writerow([row])


class UnicodeWriter:
	def __init__(self, f, dialect = csv.excel, encoding = UTF8, **kwds):
		# Redirects output to a queue
		self.queue = cStringIO.StringIO()
		self.writer = csv.writer(self.queue, dialect = dialect, **kwds)
		self.stream = f
		self.encoder = codecs.getincrementalencoder(encoding)()
	
	def writerow(self, row):
		self.writer.writerow([s.encode(UTF8) for s in row])
		
		# Fetches UTF-8 output from the queue
		data = self.queue.getvalue()
		data = data.decode(UTF8)
		
		# Re-encodes UTF-8 data into the target encoding
		data = self.encoder.encode(data)
		# Writes the data to the target stream
		self.stream.write(data)
		# Empties the queue
		self.queue.truncate(0)
	
	def writerows(self, rows):
		for row in rows:
			self.writerow(row)