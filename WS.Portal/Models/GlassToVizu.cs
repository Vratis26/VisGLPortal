namespace WS.Portal.Models
{
    public class GlassToVizu
    {
        public Glass? glass { get; set; }
        public List<Defect> defects { get; set; }
        public Cut? cut { get; set; }
        public string json { get; set; }
    }
}
