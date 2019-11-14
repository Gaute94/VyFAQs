using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SPA_Angular_Core.Models
{
    public class question
    {
        public int id { get; set; }
        [Required]
        [RegularExpression("^[a-zæøåA-ZÆØÅ0-9 \\n\\r_,'.-?]*$")]
        public string newQuestion { get; set; }
        [Required]
        [RegularExpression("^[a-zæøåA-ZÆØÅ0-9 \\n\\r_,.'-?]*$")]
        public string answer { get; set; }
        [Required]
        public int votes { get; set; }
    }
}