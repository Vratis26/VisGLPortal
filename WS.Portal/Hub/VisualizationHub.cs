using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using WS.Portal.DB;
using WS.Portal.Helpers;
using WS.Portal.Models;

namespace WS.Portal.Hubs
{
    public class VisualizationHub : Hub
    {
        private GlassDbContext _glassDbContext;
        private IConfiguration _configuration;

        public VisualizationHub(GlassDbContext glassDbContext, IConfiguration configuration)
        {
            _glassDbContext = glassDbContext;
            _configuration = configuration;
        }
        public override Task OnConnectedAsync()
        {
            Clients.Client(Context.ConnectionId).SendAsync("getName");
            return base.OnConnectedAsync();
        }

        public bool AddWithName(string name)
        {
            bool result = false;
            try
            {
                Groups.AddToGroupAsync(Context.ConnectionId, name);
                result = true;
            }
            catch(Exception ex) { }
            return result;
        }

        public int CreateGlass(string serialNum)
        {
            int result = 0;
            try {
                if (Regex.IsMatch(serialNum, _configuration.GetValue<string>("serialNumRegex")))
                {
                    _glassDbContext.Glass.Add(new Models.Glass
                    {
                        IdGlass = Guid.NewGuid(),
                        SerialNum = serialNum,
                        Height = _configuration.GetValue<int>("glassHeight"),
                        Width = _configuration.GetValue<int>("glassWidth"),
                        ModifiedDate = DateTime.Now,
                        PackNum = null,
                        Code = null,
                        DedArea = null,
                        ControlDate = null,
                        Quality = null
                    });
                    _glassDbContext.SaveChanges();
                    result = 1;
                } 
                else
                    result = 2;
                
            }
            catch (Exception ex) { result = 0; }
            return result;
        }

        public async Task<int> VisualGlass(string serialNum)
        {
            int result = 0;
            try
            {
                GlassToVizu glassToVizu = new GlassToVizu();
                glassToVizu.glass = _glassDbContext.Glass.FirstOrDefault(g => g.SerialNum == serialNum);
                if (glassToVizu.glass != null)
                {
                    glassToVizu.defects = _glassDbContext.Defect.Where(d => d.GlassId == glassToVizu.glass.IdGlass).OrderBy(d => d.DefectOrder).ToList();
                    glassToVizu.cut = _glassDbContext.Cut.FirstOrDefault(c => c.GlassId == glassToVizu.glass.IdGlass);
                    glassToVizu.json = JsonConvert.SerializeObject(glassToVizu);
                    await Clients.Group("visu").SendAsync("CreateGlass", glassToVizu.json);
                    result = 1;
                }
                else
                    result = 2;
            }
            catch(Exception ex) { result = 0; }
            return result;
        }

        public async Task<int> SendPackNumber(string packNum)
        {
            int result = 0;
            try
            {
                if (packNum.Length == _configuration.GetValue<int>("packNumLength"))
                {
                    await Clients.Group("visu").SendAsync("SendPackNum", packNum);
                    result = 1;
                }
                else
                    result = 2;
            }catch(Exception ex) { result = 0; }
            return result;
        }

        public async Task<int> SavePackNum(string json)
        {
            int ret = 0;
            try
            {
                if(json != null)
                {
                    Glass glass = JsonConvert.DeserializeObject<Glass>(json);
                    Glass fromDB = await _glassDbContext.Glass.FirstOrDefaultAsync(g => g.IdGlass == glass.IdGlass);
                    if (fromDB != null)
                    {
                        fromDB.PackNum = glass.PackNum;
                        await _glassDbContext.SaveChangesAsync();
                        ret = 1;
                    }
                    else
                        ret = 2;
                }
            }catch (Exception ex) { ret = 0; }
            return ret;
        }

        public async Task<int> SendCode(string code)
        {
            int result = 0;
            try
            {
                if (code.Length == _configuration.GetValue<int>("codeLength"))
                {
                    await Clients.Group("visu").SendAsync("SendCode", code);
                    result = 1;
                }
                else
                    result = 2;
            }
            catch (Exception ex) { result = 0; }
            return result;
        }

        public async Task<int> SaveCode(string json)
        {
            int ret = 0;
            try
            {
                if (json != null)
                {
                    Glass glass = JsonConvert.DeserializeObject<Glass>(json);
                    Glass fromDB = await _glassDbContext.Glass.FirstOrDefaultAsync(g => g.IdGlass == glass.IdGlass);
                    if (fromDB != null)
                    {
                        fromDB.Code = glass.Code;
                        await _glassDbContext.SaveChangesAsync();
                        ret = 1;
                    }
                    else
                        ret = 2;
                }
            }
            catch (Exception ex) { ret = 0; }
            return ret;
        }

        public async Task<int> SendDeformation(Coordination coordination)
        {
            int result = 0;
            try
            {
                Defect defect = Coordination2Defect.Process(coordination, _configuration.GetValue<int>("glassWidth"), _configuration.GetValue<int>("glassHeight"));
                if (defect != null)
                {
                    string json = JsonConvert.SerializeObject(defect);
                    await Clients.Group("visu").SendAsync("SendCoordinates", json);
                    result = 1;
                }
                else
                    result = 0;

            }
            catch (Exception ex) { result = 0; }
            return result;
        }

        public async Task<int> SaveDeformation(string json)
        {
            int ret = 0;
            try
            {
                if (json != null)
                {
                    Defect defect = JsonConvert.DeserializeObject<Defect>(json);
                    if(defect != null)
                    {
                        await _glassDbContext.Defect.AddAsync(defect);
                        await _glassDbContext.SaveChangesAsync();
                        ret = 1;
                    }
                    else
                        ret = 2;
                }
            }
            catch (Exception ex) { ret = 0; }
            return ret;
        }

        public async Task<int> DeleteLastDeformation()
        {
            int result = 0;
            try
            {
                await Clients.Group("visu").SendAsync("DeleteLastDefect");
                result = 1;
            }
            catch (Exception ex) { result = 0; }
            return result;
        }

        public async Task<int> RemoveDefect(string json)
        {
            int ret = 0;
            try
            {
                if (json != null)
                {
                    Defect defect = JsonConvert.DeserializeObject<Defect>(json);
                    if (defect != null)
                    {
                        _glassDbContext.Defect.Remove(defect);
                        await _glassDbContext.SaveChangesAsync();
                        ret = 1;
                    }
                    else
                        ret = 2;
                }
            }
            catch (Exception ex) { ret = 0; }
            return ret;
        }
    }
}
