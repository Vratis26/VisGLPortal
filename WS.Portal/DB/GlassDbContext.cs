using Microsoft.EntityFrameworkCore;
using WS.Portal.Models;

namespace WS.Portal.DB
{
    public class GlassDbContext : DbContext
    {
        public GlassDbContext(DbContextOptions<GlassDbContext> options) : base(options)
        {
        }
        public DbSet<Glass> Glass { get; set; }  
        public DbSet<Cut> Cut { get; set; }
        public DbSet<Defect> Defect { get; set; }
    }
}
