using System.ComponentModel.DataAnnotations;

namespace WS.Portal.Models
{
    public class Glass
    {
        [Key]
        public Guid IdGlass { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string SerialNum { get; set; }
        public string? PackNum { get; set; }
        public string? Code { get; set; }
        public int? DedArea { get; set; }
        public DateTime? ControlDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int? Quality { get; set; }
    }
}
