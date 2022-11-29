using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WS.Portal.DB;
using WS.Portal.Models;

namespace WS.Portal.Pages.Edit
{
    public class EditModel : PageModel
    {
        public GlassToVizu? glassToVizu { get; set; }
        private GlassDbContext _glassDbContext;
        private IConfiguration _configuration;
        public EditModel(GlassDbContext glassDbContext, IConfiguration configuration)
        {
            _glassDbContext = glassDbContext;
            _configuration = configuration;
        }
        public void OnGet(Guid id, bool message = false)
        {
            glassToVizu = new GlassToVizu();
            glassToVizu.glass = _glassDbContext.Glass.Find(id);
            if(glassToVizu.glass != null)
            {
                glassToVizu.defects = _glassDbContext.Defect.Where(d => d.GlassId == id).ToList();
                glassToVizu.cut = _glassDbContext.Cut.FirstOrDefault(c => c.GlassId == id);
                glassToVizu.json = JsonConvert.SerializeObject(glassToVizu);
            }
            

            ViewData["message"] = message;
        }

        public IActionResult OnGetSavePoints(string json)
        {
            try
            {
                if(json != null)
                {
                    GlassToVizu glassToSave = JsonConvert.DeserializeObject<GlassToVizu>(json);
                    Glass glass = _glassDbContext.Glass.FirstOrDefault(g => g.IdGlass == glassToSave.glass.IdGlass);
                    if (glass != null)
                    {
                        string error = null;
                        if (glassToSave.glass.Code == null || glassToSave.glass.Code.Length != _configuration.GetValue<int>("codeLength"))
                            error = "Code is not the correct length";
                        else
                            glass.Code = glassToSave.glass.Code;

                        if (glassToSave.glass.PackNum == null || glassToSave.glass.PackNum.Length != _configuration.GetValue<int>("packNumLength"))
                            error = "Package number is not the correct length";
                        else
                            glass.PackNum = glassToSave.glass.PackNum;


                        glass.ModifiedDate = DateTime.Now;
                        List<Defect> defects = _glassDbContext.Defect.Where(d => d.GlassId == glassToSave.glass.IdGlass).ToList();
                        List<Defect> insertDefect = glassToSave.defects.Where(d => d.IdDefect == null).ToList();
                        glassToSave.defects = glassToSave.defects.Except(insertDefect).ToList();
                        List<Defect> removeDefects = new List<Defect>();
                        foreach (Defect defect in defects)
                        {
                            var tmp = glassToSave.defects.FirstOrDefault(d => d.IdDefect == defect.IdDefect);
                            if (tmp != null)
                            {
                                _glassDbContext.Defect.Remove(defect);
                                _glassDbContext.Defect.Add(tmp);
                            }
                            else
                                _glassDbContext.Defect.Remove(defect);
                        }

                        foreach (Defect defect in insertDefect)
                        {
                            defect.IdDefect = new Guid();
                            _glassDbContext.Defect.Add(defect);
                        }
                        _glassDbContext.SaveChanges();

                        if (error != null)
                            throw new ArgumentException(error);

                        return RedirectToAction("/Edit/Edit", new {id = glassToSave.glass.IdGlass.ToString()});
                    }
                    

                }
                
            }
            catch(Exception ex) { }
            return RedirectToAction("/Error");
        }

        
    }
}
