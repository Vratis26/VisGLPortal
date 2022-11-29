using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace WS.Portal.Models
{
    public class Cut
    {
        [Key]
        public Guid IdCut { get; set; }
        public Guid? GlassId { get; set; }
        public int PointAX { get; set; }
        public int PointAY { get; set; }
        public int? PointBX { get; set; }
        public int? PointBY { get; set; }
    }
}
