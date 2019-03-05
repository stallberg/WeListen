from databaseApi import DBApi

from text_to_speech.tts import create_TTS_URL

dbApi = DBApi()

# answerType is always one of the following: int, str, bool, date, time, single, multi

def populateAnswerType():
    def callback():
        dbApi.createAnswerType(description="int")
        dbApi.createAnswerType(description="str")
        dbApi.createAnswerType(description="bool")
        dbApi.createAnswerType(description="date")
        dbApi.createAnswerType(description="time")
        dbApi.createAnswerType(description="single")
        dbApi.createAnswerType(description="multi")
    dbApi.perform(callback)

# Run only if you have an empty database
populateAnswerType()

form =  {
            'name': "Sample Questions for Car Insurance Claim",
            'description': "A few questions for demonstrating how WeListen can be used for filling in insurance claim forms",
            'questions': [            
                {
                    'question': "How old are you?", 
                    'answerType': "str", 
                    'orderIndex': 1,
                },
                {
                    'question': "How many cars were involved in the accident?", 
                    'answerType': "str", 
                    'orderIndex': 2,
                },
                {
                    'question': "Was your vehicle towed?", 
                    'answerType': "single", 
                    'orderIndex': 3,
                    'stringOptions': [
                        {
                            'description': "Yes",
                            'value': 0,
                            'orderIndex': 1,
                        },
                        {
                            'description': "No",
                            'value': 1,
                            'orderIndex': 2,
                            
                        },
                    ]
                },
                {
                    'question': "Please provide an explanation of the accident", 
                    'answerType': "str", 
                    'orderIndex': 4
                }
            ]
}

def newForm1():
    def callback():
        dbApi.storeForm(form)
    dbApi.perform(callback)

newForm1()

form =  {
            'name': "Sample Questions for a Bug Report",
            'description': "A few questions for demonstrating how WeListen can be used for filling in a bug report form",
            'questions': [            
                {
                    'question': "Please specify the title of the error", 
                    'answerType': "str", 
                    'orderIndex': 1,
                    
                },
                {
                    'question': "On which platforms do you experience the problem?", 
                    'answerType': "multi", 
                    'orderIndex': 2,
                    'stringOptions': [
                        {
                            'description': "Desktop",
                            'value': 0,
                            'orderIndex': 1,
                        },
                        {
                            'description': "Mobile",
                            'value': 1,
                            'orderIndex': 2,
                        },
                        {
                            'description': "Tablet",
                            'value': 2,
                            'orderIndex': 3,
                        }
                    ]
                },
                {
                    'question': "Please, give a detailed description of the error", 
                    'answerType': "str", 
                    'orderIndex': 3,
                },
                {
                    'question': "What is the severity of the error?", 
                    'answerType': "single", 
                    'orderIndex': 4,
                    'stringOptions': [
                        {
                            'description': "High",
                            'value': 0,
                            'orderIndex': 1,
                            
                        },
                        {
                            'description': "Medium",
                            'value': 1,
                            'orderIndex': 2,
                            
                        },
                        {
                            'description': "Low",
                            'value': 2,
                            'orderIndex': 3,
                            
                        }
                    ]
                }
            ]
}

def newForm2():
    def callback():
        dbApi.storeForm(form)
    dbApi.perform(callback)

newForm2()

form =  {
            'name': "Sample Questions for Requesting Kilometre and Per Diem Allowance ",
            'description': "A few questions for demonstrating how WeListen can be used for requesting kilometre and per diem allowance",
            'questions': [            
                {
                    'question': "What was the length of the business trip in kilometres?", 
                    'answerType': "str",
                    'orderIndex': 1,
                },
                {
                    'question': "Please specify the vehicle used for traveling ", 
                    'answerType': "single",
                    'orderIndex': 2,
                    'stringOptions': [
                        {
                            'description': "Car",
                            'value': 0,
                            'orderIndex': 1,

                        },
                        {
                            'description': "Car with trailer",
                            'value': 1,
                            'orderIndex': 2,

                        },
                        {
                            'description': "Motorcycle",
                            'value': 2,
                            'orderIndex': 3,

                        },
                        {
                            'description': "Snowmobile",
                            'value': 3,
                            'orderIndex': 4,

                        }
                    ]
                },
                {
                    'question': "How long did your trip take?", 
                    'answerType': "single", 
                    'orderIndex': 3,

                    'stringOptions': [
                        {
                            'description': "Under 6 hours",
                            'value': 0,
                            'orderIndex': 1,

                        },
                        {
                            'description': "6 to 10 hours",
                            'value': 1,
                            'orderIndex': 2,

                        },
                        {
                            'description': "over 10 hours",
                            'value': 2,
                            'orderIndex': 3,

                        }
                    ]
                },
                {
                    'question': "Did you get a free meal or a meal paid for by the employer during the business trip? ", 
                    'answerType': "single", 
                    'orderIndex': 4,

                    'stringOptions': [
                        {
                            'description': "Yes",
                            'value': 0,
                            'orderIndex': 1,

                        },
                        {
                            'description': "No",
                            'value': 1,
                            'orderIndex': 2,

                        }
                    ]
                },
            ]
}

def newForm3():
    def callback():
        dbApi.storeForm(form)
    dbApi.perform(callback)

newForm3()

print(dbApi.retrieveForm(1))
print(dbApi.retrieveForm(2))
print(dbApi.retrieveForm(3))

