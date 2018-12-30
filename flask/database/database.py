from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Table, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship


engine = create_engine('sqlite:///welisten.db', echo=True)

Base = declarative_base()

class DBForm(Base):
    __tablename__ = 'form'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
   
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

    stringOptions = relationship('DBStringOption', order_by='DBStringOption.orderIndex')
    rangeOptions = relationship("DBRangeOption")

    def asDict(self):
        result = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        answerType=self.answerType.description
        result['answerType'] = answerType
        if answerType == "int":
            result.update({'minValue': self.rangeOptions[0].minValue, 'maxValue': self.rangeOptions[0].maxValue})
        elif answerType == "multi":
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

Base.metadata.create_all(engine)
