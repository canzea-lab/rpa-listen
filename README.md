



# Export token created from google

export GOOGLE_APPLICATION_CREDENTIALS=api.json

export INPUT_SOURCE=http://20.20.20.20:5050

export FORWARD=http://localhost:8080/tracks


# Docker Setup

docker build -t rpa-listen .

docker run $MODE -v `pwd`:/work -e GOOGLE_APPLICATION_CREDENTIALS -e INPUT_SOURCE -e FORWARD -p 3333:3333 -p 8080:8080 --name rpa-listen rpa-listen

curl -v http://localhost:8080/bridge -X POST -d text="I want to order a pizza" -d voiceId=Amy



curl -v http://20.20.20.20:8080/tracks -X POST -F name=abc -F track=@resources/hackathon.wav -F encoding=LINEAR16


-- curl -v http://localhost:8080/tracks -X POST -F name=abc -F track=@resources/brooklyn.flac -F encoding=FLAC

-- curl -v http://localhost:8080/tracks -X POST -F name=abc -F track=@resources/hackathon.wav -F encoding=LINEAR16

-- curl -v http://localhost:8080/tracks -X GET -d text=Hello

-- curl -v -X GET http://localhost:8080/bridge -H application/x-www-form-urlencoded -d "text=I would like to order a pizza"

-- curl -o resources/hackathon.wav -L "http://localhost:5050/read?voiceId=Salli&text=Hackathon%20Day&outputFormat=pcm"

# AWS input
http://intg.186527.xyz:4022/read?voiceId=Salli&text=Hackathon%20Day&outputFormat=ogg_vorbis



curl -o sample.pcm "http://20.20.20.20:5050/read?voiceId=Salli&text=Hello%20there.&outputFormat=pcm"

curl -v http://20.20.20.20:8080/tracks -X POST -F name=abc -F track=@sample.pcm -F encoding=LINEAR16
