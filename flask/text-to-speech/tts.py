from google.cloud import texttospeech
import os
import uuid

def text_to_speech(text_input, filename):

    # Instantiates a client
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.types.SynthesisInput(text=text_input)

    voice = texttospeech.types.VoiceSelectionParams(
        language_code='en-US',
        #ssml_gender=texttospeech.enums.SsmlVoiceGender.MALE,
        name='en-US-Wavenet-D'
        )

    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    response = client.synthesize_speech(synthesis_input, voice, audio_config)

    folder = 'audio_files/'
    unique_filename = str(uuid.uuid4().hex) + '.mp3'
    save_path = folder + unique_filename

    test = filename + '.mp3'
    print(test)

    
    with open(test, 'wb') as out:
        out.write(response.audio_content)
        #print('Audio content written to file %s'%(unique_filename))
    
    #return unique_filename


