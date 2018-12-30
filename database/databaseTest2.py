from databaseApi import dbApi

# answerType is always one of the following: int, str, bool, date, time, multi

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
            'name': "TestForm 1",
            'questions': [            
                {
                    'question': "How old are you?", 
                    'answerType': "int", 
                    'maxValue': 150, 
                    'minValue': 0, 
                    'orderIndex': 1
                },
                {
                    'question': "What is your name?", 
                    'answerType': "str", 
                    'orderIndex': 2
                },
                {
                    'question': "Do you own a car?", 
                    'answerType': "bool", 
                    'orderIndex': 3
                },
                {
                    'question': "When is your birthday?", 
                    'answerType': "date", 
                    'orderIndex': 4
                },
                {
                    'question': "At what time did the accident happen?", 
                    'answerType': "time", 
                    'orderIndex': 5
                },
                {
                    'question': "What is your gender?", 
                    'answerType': 'single', 
                    'orderIndex': 6,
                    'stringOptions': [
                        {
                            'description': "Male", 
                            'value': 0, 
                            'orderIndex': 1
                        },
                        {
                            'description': "Female", 
                            'value': 1,
                            'orderIndex': 2
                        },
                    ]
                },
                {
                    'question': "Which of the following do you have?", 
                    'answerType': 'multi', 
                    'orderIndex': 7,
                    'stringOptions': [
                        {
                            'description': "Phone", 
                            'value': 0, 
                            'orderIndex': 1
                        },
                        {
                            'description': "Desktop", 
                            'value': 1,
                            'orderIndex': 2
                        },
                        {
                            'description': "Tablet", 
                            'value': 2,
                            'orderIndex': 3
                        },
                        {
                            'description': "Laptop", 
                            'value': 3,
                            'orderIndex': 4
                        },
                    ]
                }
            ]
}

def newForm():
    def callback():
        dbApi.storeForm(form)
    dbApi.perform(callback)

newForm()

print(dbApi.retrieveForm(1))
