using Microsoft.Extensions.Logging;
using WS.Portal.Models;

namespace WS.Portal.Helpers
{
    public static class Coordination2Defect
    {
        public static Defect Process(Coordination coordination, int glassWidth, int glassHeight)
        {
            Defect defect = null;
            switch (coordination.Type)
            {
                case "DEFP":
                    defect = CreatePointDefect(coordination);
                    break;
                case "DEFT":
                    defect = CreateEdgeDefect(coordination, glassWidth, glassHeight);
                    break;
                case "DEFS":
                    defect = CreateAreaDefect(coordination);
                    break;
                default:
                    defect = null;
                    break;
            }
            return defect;
        }

        private static Defect? CreateAreaDefect(Coordination coordination)
        {
            Defect defect = new Defect
            {
                IdDefect = Guid.NewGuid(),
                Type = coordination.Type,
                GlassId = null,
                DefectOrder = 0
            };
            if (coordination.PointBX != null && coordination.PointBY != null)
            {
                if (coordination.PointAX < coordination.PointBX)
                {
                    if (coordination.PointAY < coordination.PointBY)
                    {
                        defect.PointAX = coordination.PointAX;
                        defect.PointAY = coordination.PointAY;
                        defect.PointBX = coordination.PointBX;
                        defect.PointBY = coordination.PointBY;
                    }
                    else
                    {
                        defect.PointAX = coordination.PointAX;
                        defect.PointAY = coordination.PointBY.Value;
                        defect.PointBX = coordination.PointBX;
                        defect.PointBY = coordination.PointAY;
                    }
                }
                else
                {
                    if (coordination.PointAY < coordination.PointBY)
                    {
                        defect.PointAX = coordination.PointBX.Value;
                        defect.PointAY = coordination.PointAY;
                        defect.PointBX = coordination.PointAX;
                        defect.PointBY = coordination.PointBY.Value;
                    }
                    else
                    {
                        defect.PointAX = coordination.PointBX.Value;
                        defect.PointAY = coordination.PointBY.Value;
                        defect.PointBX = coordination.PointAX;
                        defect.PointBY = coordination.PointAY;
                    }
                }
            }
            else
                defect = null;

            return defect;
        }

        private static Defect? CreateEdgeDefect(Coordination coordination, int glassWidth, int glassHeight)
        {
            Defect defect = new Defect
            {
                IdDefect = Guid.NewGuid(),
                Type = coordination.Type,
                GlassId = null,
                DefectOrder = 0
            };

            if (glassHeight != null && glassWidth != null)
            {
                switch (getNeerestSide(coordination.PointAX, coordination.PointAY, glassWidth, glassHeight))
                {
                    case 0:
                        defect.PointAX = 0;
                        defect.PointAY = 0;
                        defect.PointBX = glassWidth;
                        defect.PointBY = coordination.PointAY;
                        break;
                    case 1:
                        defect.PointAX = 0;
                        defect.PointAY = coordination.PointAY;
                        defect.PointBX = glassWidth;
                        defect.PointBY = glassHeight;
                        break;
                    case 2:
                        defect.PointAX = 0;
                        defect.PointAY = 0;
                        defect.PointBX = coordination.PointAX;
                        defect.PointBY = glassHeight;
                        break;
                    case 3:
                        defect.PointAX = coordination.PointAX;
                        defect.PointAY = 0;
                        defect.PointBX = glassWidth;
                        defect.PointBY = glassHeight;
                        break;
                    default:
                        defect = null;
                        break;
                }
            }
            else
                defect = null;
            

            return defect;
        }

        private static int getNeerestSide(int pointAX, int pointAY, int glassWidth, int glassHeight)
        {
            List<double> dist = new List<double>();
            var aBottom = (0 - 0) / (glassWidth - 0);
            var cBottom = (0 - (aBottom * glassWidth));

            dist.Add((Math.Abs(aBottom * pointAX - pointAY + cBottom) / Math.Sqrt(aBottom * aBottom + 1)));

            var aTop = (glassHeight - glassHeight) / (glassWidth - 0);
            var cTop = (glassHeight - (aTop * glassWidth));

            dist.Add((Math.Abs(aTop * pointAX - pointAY + cTop) / Math.Sqrt(aTop * aTop + 1)));

            var aLeft = (glassHeight - 0) / (1 - 0);
            var cLeft = (glassHeight - (aLeft * 0));

            dist.Add((Math.Abs(aLeft * pointAX - pointAY + cLeft) / Math.Sqrt(aLeft * aLeft + 1)));

            var aRight = (glassHeight - 0);
            var cRight = (glassHeight - (aRight * glassWidth));

            dist.Add((Math.Abs(aRight * pointAX - pointAY + cRight) / Math.Sqrt(aRight * aRight + 1)));

            return dist.IndexOf(dist.Min());
        }

        private static Defect CreatePointDefect(Coordination coordination)
        {
            return new Defect()
            {
                IdDefect = Guid.NewGuid(),
                Type = coordination.Type,
                PointAX = coordination.PointAX,
                PointAY = coordination.PointAY,
                PointBX = null,
                PointBY = null,
                DefectOrder = 0,
                GlassId = null,
            };
        }
    }
}
