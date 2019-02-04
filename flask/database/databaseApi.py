from database import DBForm, DBQuestion, DBAnswerType, DBStringOption, DBRangeOption, DBAnswer, DBAnswerString, DBAnswerInt, DBAnswerDate, DBAnswerTime
from database import engine

from sqlalchemy.orm import sessionmaker

Session = sessionmaker(bind=engine)

class DBApi:
    session = Session()     

    
    def perform(self, callback):
        
        # FIXME: This is prone to bugs if a get[Something] is called first or outside perform.
        
        callback()

        self.session.commit()
         
        # FIXME: There's more to do here, exception handling, rollback, ... 
 
 
    def createForm(self, name, description):
        form = DBForm(name = name, description = description)
        self.session.add(form)
        return form
         
    def getForms(self):
        return self.session.query(DBForm)
         
    def createAnswerType(self, description):
        answerType = DBAnswerType(description = description)
        self.session.add(answerType)
        return answerType

    def getAnswerType(self):
        return self.session.query(DBAnswerType)
    
    def createRangeOption(self, minValue, maxValue):
        newRangeOption = DBRangeOption(minValue=minValue, maxValue=maxValue)
        self.session.add(newRangeOption)
        return newRangeOption

    def getRangeOption(self):
        return self.session.query(DBRangeOption)
  
    def createStringOption(self, value, description, orderIndex):
        newStringOption = DBStringOption(value=value, description=description, orderIndex=orderIndex)
        self.session.add(newStringOption)
        return newStringOption

    def getStringOption(self):
        return self.session.query(DBStringOption)
  
    def createQuestion(self, question, answerType=None, orderIndex=None):
        newQuestion=DBQuestion(question = question)
        if answerType != None:
            newQuestion.answerType = answerType
        if orderIndex != None:
            newQuestion.orderIndex = orderIndex
        self.session.add(newQuestion)
        return newQuestion

    def storeForm(self, form):
        newForm=self.createForm(form['name'], form['description'])
        for question in form['questions']:
            answerType=self.session.query(DBAnswerType).filter(DBAnswerType.description==question['answerType'])[0]
            newQuestion=self.createQuestion(question=question['question'], answerType=answerType, orderIndex=question['orderIndex'])
            if question['answerType']=="int":
                newRangeOption=self.createRangeOption(minValue=question['minValue'], maxValue=question['maxValue'])
                newQuestion.rangeOptions.append(newRangeOption)
            elif (question['answerType']=="multi") or (question['answerType']=="single"):
                for stringOption in question['stringOptions']:
                    newStringOption=self.createStringOption(value=stringOption['value'], description=stringOption['description'], orderIndex=stringOption['orderIndex'])
                    newQuestion.stringOptions.append(newStringOption)
                    
                    
            newForm.questions.append(newQuestion)
        return newForm

    def retrieveForm(self, id):
        return self.session.query(DBForm).filter(DBForm.id == id).first().asDict()

    def createAnswer(self, uid):
        answer = DBAnswer(uid=uid)
        self.session.add(answer)
        return answer

    def createAnswerString(self, answer):
        answerString = DBAnswerString(answer=answer)
        self.session.add(answerString)
        return answer

    def createAnswerInt(self, answer):
        answerInt = DBAnswerInt(answer=answer)
        self.session.add(answerInt)
        return answer

    def createAnswerDate(self, answer):
        answerDate = DBAnswerDate(answer=answer)
        self.session.add(answerDate)
        return answer

    def createAnswerTime(self, answer):
        answerTime = DBAnswerTime(answer=answer)
        self.session.add(answerTime)
        return answer

dbApi = DBApi()

