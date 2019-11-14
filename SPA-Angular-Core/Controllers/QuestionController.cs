using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using System.Net.Http.Formatting;
using System.Data.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters.Json;

using SPA_Angular_Core.Models;

namespace SPA_Angular_Core.Controllers
{
        [Route("api/[controller]")]
        public class QuestionController : Controller
        {
            private readonly QuestionContext _context;
            public QuestionController(QuestionContext context)
            {
                _context = context;
            }

            // GET api/Question
            [HttpGet]
            public JsonResult Get()
            {
                var questionDB = new QuestionDB(_context);
                List<question> alleKunder = questionDB.getAllQuestions();
                List<question> sortedQuestion = alleKunder.OrderBy(q => q.votes).ToList();
                sortedQuestion.Reverse();
            return Json(sortedQuestion);
            }

            // GET api/Question/5
            [HttpGet("{id}")]
            public JsonResult Get(int id)
            {
                var questionDB = new QuestionDB(_context);
                question singleQuestion = questionDB.getQuestion(id);
                return Json(singleQuestion);
            }

            // POST api/Question
            [HttpPost]
            public JsonResult Post([FromBody]question inQuestion)
            {
                if (ModelState.IsValid)
                {
                    var questionDB = new QuestionDB(_context);
                    inQuestion.answer = inQuestion.answer.Replace("\n", "<br />");
                    bool OK = questionDB.saveQuestion(inQuestion);
                    if (OK)
                    {
                        return Json("OK");
                    }
                }
                return Json("Could not save question in DB");
            }

            // PUT api/Question/5
            [HttpPut("{id}")]
            public JsonResult Put(int id, [FromBody]question inQuestion)
            {
                if (ModelState.IsValid)
                {
                    var questionDB = new QuestionDB(_context);
                    bool OK = questionDB.updateQuestion(id, inQuestion);
                    if (OK)
                    {
                        return Json("OK");
                    }
                }
                return Json("Could not update question in DB");
            }

        [HttpGet("upvoteQuestion/{id}")]
        public JsonResult Upvote(int id) {
            System.Diagnostics.Debug.WriteLine("Upvote ID: " + id);
            var questionDB = new QuestionDB(_context);
            bool OK = questionDB.upvoteQuestion(id);
            if (OK)
            {
                System.Diagnostics.Debug.WriteLine("Inside OK");
                return Json("OK");
            }
            return Json("Could not update votes");
        }
        [HttpGet("downvoteQuestion/{id}")]
        public JsonResult Downvote(int id)
        {
            System.Diagnostics.Debug.WriteLine("Upvote ID: " + id);
            var questionDB = new QuestionDB(_context);
            bool OK = questionDB.downvoteQuestion(id);
            if (OK)
            {
                System.Diagnostics.Debug.WriteLine("Inside OK");
                return Json("OK");
            }
            return Json("Could not update votes");
        }
        // DELETE api/Question/5
        [HttpDelete("{id}")]
            public JsonResult Delete(int id)
            {
                var questionDB = new QuestionDB(_context);
                bool OK = questionDB.deleteQuestion(id);
                if (!OK)
                {
                    return Json("Could not delete question!");
                }
                return Json("OK");
            }
        }
}