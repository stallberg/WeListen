from flask import Flask, request, render_template

# for getting the samplerate
import soundfile as sf

#The required google client libraries
from google.cloud import storage
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

app = Flask(__name__)


#Initialize the speech client for making api requests
speech_client = speech.SpeechClient()

def generate_speech_config(sample_rate):
    speech_config = types.RecognitionConfig(
    encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz = sample_rate,
    language_code = 'en-US')

    return speech_config

#Synchronous speech rec for audio < 1 min, otherwise async speech recognition
def recognize(data, sample_rate, audio_duration_seconds):

    audio = types.RecognitionAudio(content=data)
    speech_config = generate_speech_config(sample_rate)

    #Synchronous speech recognition
    if audio_duration_seconds < 60:
        response = speech_client.recognize(speech_config, audio)

    #Async speech recognition
    #TODO make it work with cloud storage
    else:
        return 'Cannnot send inline audio that is longer than 1 minute.'
        #response = speech_client.long_running_recognize(speech_config, audio)
    
    #for debugging
    print("Response:\n\n", response)

    transcription = ''
    for result in response.results:
        transcription += result.alternatives[0].transcript

    return transcription



#TODO IMPLEMENT THIS TO STORE AUDIO FILE ON CLOUD STORAGE WHEN LENGTH > 1 MINUTE
def upload_to_bucket(data):
  
    storage_client = storage.Client()
    bucket = storage_client.get_bucket('speech_recognition_audio')

    #blob = bucket.blob('test')
    #blob.upload_from_file()
    
    #blob = bucket.blob(blob_name)
    #blob.upload_from_filename(path_to_file)

    #returns a public url
    #return blob.public_url


@app.route('/')
def mainpage():
    return render_template("index.html")

@app.route('/recognize', methods=['POST'])
def audio():

    #get the file from the post from client
    data = request.files['audio_data']

    # get sample rate and audio duration
    f = sf.SoundFile(data)
    sample_rate = f.samplerate
    audio_duration_seconds = (len(f) / sample_rate)

    #Debugging
    print(sample_rate)
    print(audio_duration_seconds)

    response = recognize(data.read(), sample_rate, audio_duration_seconds)   
    return response



if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000)


