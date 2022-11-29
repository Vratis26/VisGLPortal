using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using WS.Portal.DB;
using WS.Portal.Models;

namespace WS.Portal.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private readonly GlassDbContext _glassDbContext;

        public IndexModel(ILogger<IndexModel> logger, GlassDbContext glassDbContext)
        {
            _logger = logger;
            _glassDbContext = glassDbContext;
        }

        public void OnGet()
        {
            glasses = _glassDbContext.Glass.OrderByDescending(g => g.ModifiedDate).Take(5);
        }
        
        public IEnumerable<Glass> glasses { get; set; } = Enumerable.Empty<Glass>();
    }
}