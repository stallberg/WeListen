from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Table, Column, Integer, String, Date, Time, ForeignKey
from sqlalchemy.orm import relationship


engine = create_engine('sqlite:///welisten.db',
                        echo=True, 
                        connect_args={'check_same_thread': False}
                        )

Base = declarative_base()

class DBForm(Base):
    __tablename__ = 'form'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    questions = relationship('DBQuestion', order_by='DBQuestion.orderIndex')
    
    def asDict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        result['questions'] = []
        for question in self.questions:
            result['questions'].append(question.asDict())
        return result

class DBQuestion(Base):
    __tablename__ = 'question'
    
    id = Column(Integer, primary_key=True)
    question = Column(String)
   
    formId = Column(Integer, ForeignKey('form.id'))

    answerTypeId = Column(Integer, ForeignKey('answerType.id'))
    answerType = relationship('DBAnswerType')

    orderIndex = Column(Integer)

    #For text-to-speech
    audioUrl = Column(String)

    stringOptions = relationship('DBStringOption', order_by='DBStringOption.orderIndex')
    rangeOptions = relationship("DBRangeOption")
    answers = relationship("DBAnswer")

    def asDict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        answerType=self.answerType.description
        result['answerType'] = answerType
        if answerType == "int":
            result.update({'minValue': self.rangeOptions[0].minValue, 'maxValue': self.rangeOptions[0].maxValue})
        elif answerType == "multi" or answerType == "single":
            result['stringOptions']=[]
            for option in self.stringOptions:
                result['stringOptions'].append(option.asDict())
        return result
        
class DBAnswerType(Base):
    __tablename__ = 'answerType'
    
    id = Column(Integer, primary_key=True)
    description = Column(String, unique=True)
    
    def asDict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class DBStringOption(Base):
    __tablename__ = 'stringOption'
    
    id = Column(Integer, primary_key=True)
    questionId = Column(Integer, ForeignKey('question.id'))
    
    value = Column(Integer)
    description = Column(String)
    
    orderIndex = Column(Integer)
   
    def asDict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    

class DBRangeOption(Base):
    __tablename__ = 'rangeOption'

    id = Column(Integer, primary_key=True)
    questionId = Column(Integer, ForeignKey('question.id'))
    
    minValue = Column(Integer)
    maxValue = Column(Integer)

    def asDict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class DBAnswer(Base):
    __tablename__ = 'answer'

    id = Column(Integer, primary_key=True)
    uid = Column(Integer)
    questionId = Column(Integer, ForeignKey('question.id'))
    answerStrings = relationship("DBAnswerString")
    answerStrings = relationship("DBAnswerInt")
    answerStrings = relationship("DBAnswerDate")
    answerStrings = relationship("DBAnswerTime")

class DBAnswerString(Base):
    __tablename__ = 'answerString'

    id = Column(Integer, primary_key=True)
    answerId = Column(Integer, ForeignKey('answer.id'))
    answer = Column(String)

class DBAnswerInt(Base):
    __tablename__ = 'answerInt'

    id = Column(Integer, primary_key=True)
    answerId = Column(Integer, ForeignKey('answer.id'))
    answer = Column(Integer)

class DBAnswerDate(Base):
    __tablename__ = 'answerDate'

    id = Column(Integer, primary_key=True)
    answerId = Column(Integer, ForeignKey('answer.id'))
    answer = Column(Date)

class DBAnswerTime(Base):
    __tablename__ = 'answerTime'

    id = Column(Integer, primary_key=True)
    answerId = Column(Integer, ForeignKey('answer.id'))
    answer = Column(Time)

Base.metadata.create_all(engine)
