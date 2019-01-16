from tts import text_to_speech

if __name__ == '__main__':
    text_to_speech("Please specify the title of the error.", "q1")
    text_to_speech("Which platforms are you using? Desktop, Mobile, or Tablet?", "q2")
    text_to_speech("Please describe the error details.", "q3")
    text_to_speech("You have reached the final question. What is the severity of the error? High, Medium, or Low?", "q4")
