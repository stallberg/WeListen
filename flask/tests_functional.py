# This file contains automated UI tests (functional tests) written as user stories

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
import unittest
import time
import requests

class FillInFormTest(unittest.TestCase):

    def setUp(self):
        self.browser = webdriver.Firefox()
        self.wait = WebDriverWait(self.browser, 10)

    def tearDown(self):
        self.browser.quit()

    #Helper function to make sure that the document is loaded
    def waitforload(self):
        self.wait.until(lambda d: d.execute_script(
        'return (document.readyState == "complete" || document.readyState == "interactive")'))

    def enterInput(self, element, question_type):
        if question_type == 'str' or question_type == 'int':
            if question_type == 'str':
                user_input = "Test string input"
            elif question_type == 'int':
                user_input = "10"
            element.send_keys(user_input)

        elif question_type == 'single':
            webdriver.ActionChains(self.browser).move_to_element(element).click(element).perform()
            self.assertTrue(element.is_selected())
        elif question_type == 'multi':
            for choice in element:
                webdriver.ActionChains(self.browser).move_to_element(choice).click(choice).perform()
                self.assertTrue(choice.is_selected())

    
    def test_form_review_functionality(self):
        self.browser.get('http://localhost:8000/forms/2/')
        resp = requests.get('http://localhost:8000/forms/2/json/')
        form = resp.json()
        questions_length = len(form['questions'])
        
        #User goes through all the questions until he/she reaches the last one
        for i in range(questions_length):
            if i != questions_length -1:
                self.browser.find_element_by_id('nextButton').click()

        #User clicks on the review button
        self.browser.find_element_by_id('reviewButton').click()

        #Form summary modal is opened
        self.assertTrue(self.browser.find_element_by_id('reviewModal').is_enabled())

    
    def test_editquestion_and_save_functionality(self):
        #User opens up the bug report form
        self.browser.get('http://localhost:8000/forms/2/')
        resp = requests.get('http://localhost:8000/forms/2/json/')
        form = resp.json()
        questions_length = len(form['questions'])
        
        #User goes through all the questions until he/she reaches the last one
        for i in range(questions_length):
            if i != questions_length -1:
                self.browser.find_element_by_id('nextButton').click()

        #User clicks on the review button and modal opens up
        self.browser.find_element_by_id('reviewButton').click()

        #User edits the answer of the first question
        e = self.browser.find_element_by_class_name('edit-button')
        webdriver.ActionChains(self.browser).move_to_element(e).click(e).perform()
        time.sleep(1)
        self.browser.find_element_by_id('clearButton').click()
        self.assertEqual(self.browser.find_element_by_id('transcription').get_attribute('value'), '')

        self.browser.find_element_by_id('transcription').send_keys("Edited Answer")
        self.assertEqual(self.browser.find_element_by_id('transcription').get_attribute('value'), "Edited Answer")

        self.browser.find_element_by_id('saveButton').click()

        #User is now back at the form review modal

        self.assertTrue(self.browser.find_element_by_id('reviewModal').is_enabled())



    def test_next_and_previous_buttons(self):
        self.browser.get('http://localhost:8000/forms/1/')
        resp = requests.get('http://localhost:8000/forms/1/json/')
        form = resp.json()

        #User moves to the next question
        self.browser.find_element_by_id('nextButton').click()
        question = self.browser.find_element_by_id('question').get_attribute('innerHTML')
        #Check that the question has properly changed
        self.assertEqual(question, form['questions'][1]['question'])

        #User clicks the previous button to go back to the original question
        self.assertTrue(self.browser.find_element_by_id('previousButton').is_enabled())
        self.browser.find_element_by_id('previousButton').click()
        question = self.browser.find_element_by_id('question').get_attribute('innerHTML')
        self.assertEqual(question, form['questions'][0]['question'])

        #Since the user is at the first question of the form, the previous button should be disabled
        self.assertFalse(self.browser.find_element_by_id('previousButton').is_enabled())

    #Test that the clear button works properly for the different question types
    def test_clear_button_functionality(self):
        self.browser.get('http://localhost:8000/forms/2/')
        resp = requests.get('http://localhost:8000/forms/2/json/')
        form = resp.json()

        questions_length = len(form['questions'])

        clear_button = self.browser.find_element_by_id('clearButton')
        
        #Loop through all the questions
        for i in range(questions_length):
            self.waitforload()
            question_type = form['questions'][i]['answerType']

            if(question_type == 'str' or question_type == 'int'):
                element = self.browser.find_element_by_id('transcription')
                self.enterInput(element, question_type)
                clear_button.click()
                text_area_content = element.get_attribute('innerHTML')
                #Assert that the text area is empty after a clear
                self.assertEqual(text_area_content, '')

            elif(question_type == 'single'):
                #Just click the first possible choice
                first_choice = self.browser.find_element_by_class_name('custom-control-input')
                self.enterInput(first_choice, question_type)
                #Assert that it got selected
                self.assertTrue(first_choice.is_selected())
                clear_button.click()
                #Assert that it got unselected
                self.assertFalse(first_choice.is_selected())
            
            elif(question_type == 'multi'):
                choices = self.browser.find_elements_by_class_name('custom-control-input')
                self.enterInput(choices, question_type)

                clear_button.click()

                #Assert that the checkboxes did get unselected
                for choice in choices:
                    self.assertFalse(choice.is_selected())


            if(i != questions_length-1):
                self.browser.find_element_by_id('nextButton').click()


    def test_filling_carinsurance_form(self):
        self.fill_in_form(1)

    def test_filling_bugreport_form(self):
        self.fill_in_form(2)

    def test_filling_km_perdiem_form(self):
        self.fill_in_form(3)

    def fill_in_form(self, id):
        index_url = "http://localhost:8000/"
        self.browser.get(index_url + 'forms/' + str(id) + '/')
        resp = requests.get(index_url + 'forms/' + str(id) + '/json/')
        form = resp.json()
        
        questions_length = len(form['questions'])
        
        #Loop through all the questions
        for i in range(questions_length):
            self.waitforload()
            question_title = self.browser.find_element_by_id('question').get_attribute('innerHTML')
            self.assertEqual(question_title, form['questions'][i]['question'])

            question_type = form['questions'][i]['answerType']
            print(question_type)

            if(question_type == 'str' or question_type == 'int'):
                element = self.browser.find_element_by_id('transcription')
                self.enterInput(element, question_type)

            elif(question_type == 'single'):
                #Just click the first possible choice
                first_choice = self.browser.find_element_by_class_name('custom-control-input')
                self.enterInput(first_choice, question_type)
                #Assert that it got selected
                self.assertTrue(first_choice.is_selected())
            
            elif(question_type == 'multi'):
                choices = self.browser.find_elements_by_class_name('custom-control-input')
                self.enterInput(choices, question_type)
                
            time.sleep(1)

            #if at the last question
            if(i == questions_length-1):
                self.browser.find_element_by_id('reviewButton').click()
                time.sleep(1)
                #User wants to edit the first question
                
            else:
                self.browser.find_element_by_id('nextButton').click()
            
        self.browser.find_element_by_id('submitButton').click()
        time.sleep(2.5)

        #The user has successfully been redirected to the index page after submitting the form
        self.assertEqual(self.browser.current_url, index_url)


if __name__ == '__main__':
    unittest.main()