from databaseApi import dbApi

# Lists all available forms
for form in dbApi.getForms():
    print(form.id)
    print(form.name)
    print(form.description,"\n")
    
