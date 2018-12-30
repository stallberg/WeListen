from databaseApi import dbApi

def testForm():
    
    def callback():
        dbApi.createForm("Form1")
        dbApi.createForm("Form2")
    
    dbApi.perform(callback)
    
    for form in dbApi.getForms():
        print(form.name)
    