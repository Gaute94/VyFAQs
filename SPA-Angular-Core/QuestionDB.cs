using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Web;
using Microsoft.EntityFrameworkCore;
using SPA_Angular_Core.Models;

namespace SPA_Angular_Core
{

    public class QuestionDB
    {
        private readonly QuestionContext _context;
        public QuestionDB(QuestionContext context)
        {
            _context = context;
        }

        public List<question> getAllQuestions()
        {
            // merk, har oppdatert med Include for å laste uten lazy loading
            List<question> allQuestions = _context.Questions.Select(q => new question()
            {
                id = q.id,
                newQuestion = q.newQuestion,
                answer = q.answer,
                votes = q.votes,
            }).ToList();
            return allQuestions;
        }

        public question getQuestion(int id)
        {

            Question DBQuestion = _context.Questions.FirstOrDefault(q => q.id == id);

            var question = new question()
            {
                id = DBQuestion.id,
                newQuestion = DBQuestion.newQuestion,
                answer = DBQuestion.answer,
                votes = DBQuestion.votes,

            };
            return question;
        }

        public bool saveQuestion(question inQuestion)
        {
            var newQuestion = new Question
            {
                newQuestion = inQuestion.newQuestion,
                answer = inQuestion.answer,
                votes = inQuestion.votes
            };

            try
            {
                // lagre kunden
                _context.Questions.Add(newQuestion);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
        public bool updateQuestion(int id, question inQuestion)
        {
            // finn kunden
            Question foundQuestion = _context.Questions.FirstOrDefault(q => q.id == id);
            if (foundQuestion == null)
            {
                return false;
            }
            // legg inn ny verdier i denne fra innKunde
            foundQuestion.newQuestion = inQuestion.newQuestion;
            foundQuestion.answer = inQuestion.answer;
            foundQuestion.votes = inQuestion.votes;
            try
            {
                // lagre kunden
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }

        public bool upvoteQuestion(int id)
        {
            System.Diagnostics.Debug.WriteLine("QuestionDB ID: " + id);
            Question foundQuestion = _context.Questions.FirstOrDefault(q => q.id == id);
            if(foundQuestion == null)
            {
                System.Diagnostics.Debug.WriteLine("foundQuestion is null");
                return false;
            }
            System.Diagnostics.Debug.WriteLine("Votes before: " + foundQuestion.votes);
            foundQuestion.votes++;
            System.Diagnostics.Debug.WriteLine("Votes after = " + foundQuestion.votes);
            try
            {
                _context.SaveChanges();
            }
            catch(Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Could not save changes is QuestionDB");
                return false;
            }
            return true;
        }

        public bool downvoteQuestion(int id)
        {
            System.Diagnostics.Debug.WriteLine("QuestionDB ID: " + id);
            Question foundQuestion = _context.Questions.FirstOrDefault(q => q.id == id);
            if (foundQuestion == null)
            {
                System.Diagnostics.Debug.WriteLine("foundQuestion is null");
                return false;
            }
            System.Diagnostics.Debug.WriteLine("Votes before: " + foundQuestion.votes);
            foundQuestion.votes--;
            System.Diagnostics.Debug.WriteLine("Votes after = " + foundQuestion.votes);
            try
            {
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("Could not save changes is QuestionDB");
                return false;
            }
            return true;
        }

        public bool deleteQuestion(int id)
        {
            try
            {
                Question findQuestion = _context.Questions.Find(id);
                _context.Questions.Remove(findQuestion);
                _context.SaveChanges();
            }
            catch (Exception e)
            {
                return false;
            }
            return true;
        }
    }
}