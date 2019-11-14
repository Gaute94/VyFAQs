using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace SPA_Angular_Core.Models
{
    public class Question
    {
        [Key]
        public int id { get; set; }
        public string newQuestion { get; set; }
        public string answer { get; set; }
        public int votes { get; set; }
    }

    //public class Poststed
    //{
    //    [Key]
    //    public string postnr { get; set; }
    //    public string poststed { get; set; }

    //    public virtual List<Kunde> kunder { get; set; }
    //}

    public class QuestionContext : DbContext
    {
        public QuestionContext(DbContextOptions<QuestionContext> options)
        : base(options) { }

        public DbSet<Question> Questions { get; set; }
    }
}