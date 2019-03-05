from google.cloud import texttospeech
from google.cloud import storage
import os
import uuid

#returns filename of created mp3
def text_to_speech(question, options):

    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    text_input = question

    #For normal string input questions
    if options == None:
        synthesis_input = texttospeech.types.SynthesisInput(text=text_input)

    #Single/multiple choice questions also need to create TTS from the available options
    else:
        if(text_input[len(text_input) - 1] != '.' and text_input[len(text_input) - 1] != '?') :
            text_input += '.'
        
        for i in range(len(options)):
            if i == len(options) - 1:
                text_input += 'or ' + options[i]['description'] + '.'
            else:
                text_input += options[i]['description'] + ', '
        synthesis_input = texttospeech.types.SynthesisInput(text=text_input)

    voice = texttospeech.types.VoiceSelectionParams(
        language_code='en-US',
        #ssml_gender=texttospeech.enums.SsmlVoiceGender.MALE,
        name='en-US-Wavenet-D'
        )

    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    response = client.synthesize_speech(synthesis_input, voice, audio_config)

    unique_filename = str(uuid.uuid4().hex) + '.mp3'

    with open(unique_filename, 'wb') as out:
        out.write(response.audio_content)

    return unique_filename


#Uploads created mp3 file to cloud bucket
#And returns the url to the resource
def upload_file_to_bucket(filename):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket("speech_recognition_audio")
    blob = bucket.blob(filename)
    blob.upload_from_filename(filename)
    
    #Remove file locally after it's been uploaded to the bucket
    os.remove(filename)

    return 'https://storage.googleapis.com/speech_recognition_audio/' + filename


##Used by the DB api to create the TTS audio for questions
##Returns url for cloud bucket link
def create_TTS_URL(question, options):
    filename = text_to_speech(question, options)
    audio_url = upload_file_to_bucket(filename)
    return audio_url


