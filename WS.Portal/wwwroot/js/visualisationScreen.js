var pointA = [-1.0, -1.0];
var pointB = [-1.0, -1.0];
var proportion = 0.0;
var windowWidth = 0;
var windowHeight = 0;
var imgLogo = new Image();
var canvas = document.getElementById("src");
var ctx = canvas.getContext("2d");
var mouseDown = false;
var mouseMoved = false;
var lineMove = null;
var logoWidth = 0;
var logoHeight = 0;
var proportionLogo = 0;
var glassWidth = 3210;
var glassHeight = 2250;
var acc = 5;
var fontSize = 50;
var fontPadding = 10;
var scaleLineLength = 20;
var scaleMinDistLeft = 120;
var scaleMinDistButton = 60;
var scaleSpacingText = 200;
var scaleSpacing = 100;
var touch = false;
var edgeSize = 24;
var profit = [];
var json = null;

//typ, bodX (x, y), bodY (x, y)
//typ - DEFS - plocha; DEFP - bod; DEFT - hrana
var points = [];
var pointSize = 20;

window.onload = function () {


    var windowSize = window.innerWidth;
    windowWidth = document.getElementById("main-content-wrapper-src").clientWidth;

    windowWidth -= 48;

    windowHeight = ((windowWidth / 16) * 9) * 0.95;
    logoWidth = imgLogo.width;
    logoHeight = imgLogo.height;
    proportionLogo = windowWidth / logoWidth;

    proportion = windowWidth / (glassWidth + scaleMinDistLeft);

    if (windowHeight < ((glassHeight + scaleMinDistButton) * proportion)) {
        proportion = windowHeight / (glassHeight + scaleMinDistButton);
    }

    windowWidth = (glassWidth + 200) * proportion;

    canvas.height = windowHeight;
    canvas.width = windowWidth;

    maxCommentHeight = (windowHeight * 0.14) / proportion;

    repaintObjects();
}

window.onresize = function () {
    var windowSize = window.innerWidth;
    windowWidth = document.getElementById("main-content-wrapper-src").clientWidth;

    windowWidth -= 48;

    windowHeight = ((windowWidth / 16) * 9);
    logoWidth = imgLogo.width;
    logoHeight = imgLogo.height;
    proportionLogo = windowWidth / logoWidth;

    proportion = windowWidth / (glassWidth + scaleMinDistLeft);

    if (windowHeight < ((glassHeight + scaleMinDistButton) * proportion)) {
        proportion = windowHeight / (glassHeight + scaleMinDistButton);
    }
    windowWidth = (glassWidth + 200) * proportion;
    canvas.height = windowHeight;
    canvas.width = windowWidth;

    maxCommentHeight = (windowHeight * 0.14) / proportion;

    repaintObjects();
}

function repaintObjects() {
    ctx.clearRect(0, 0, windowWidth, windowHeight);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    var textWidth = 40;
    //sklo
    ctx.beginPath();
    ctx.strokeRect(scaleMinDistLeft * proportion, 0, glassWidth * proportion, glassHeight * proportion);
    ctx.closePath();

    ctx.font = (fontSize * proportion) + "px Arial";
    ctx.lineWidth = 2;

    //horni pomocna linka
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(scaleMinDistLeft * proportion, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.fillText(glassHeight, 0, fontSize * proportion);

    //prava pomocna linka
    ctx.beginPath();
    ctx.moveTo((glassWidth + scaleMinDistLeft) * proportion, (glassHeight + scaleMinDistButton) * proportion);
    ctx.lineTo((glassWidth + scaleMinDistLeft) * proportion, glassHeight * proportion);
    ctx.closePath();
    ctx.stroke();
    ctx.fillText(glassWidth, ((glassWidth + scaleMinDistLeft - fontPadding) * proportion) - ctx.measureText(glassWidth).width, (glassHeight + scaleMinDistButton) * proportion);

    ctx.fillText("0", ((scaleMinDistLeft - fontPadding) * proportion) - ctx.measureText("0").width, (glassHeight + fontSize) * proportion);
    var scaleX = glassHeight;
    var i = 0;

    while (scaleX * proportion > 0) {
        if (i % scaleSpacingText == 0) {
            ctx.beginPath();
            ctx.moveTo(0, scaleX * proportion);
            ctx.lineTo(scaleMinDistLeft * proportion, scaleX * proportion);
            ctx.closePath();
            ctx.stroke();
            if (i > 0) {
                ctx.fillText(i, 0, (scaleX + fontSize) * proportion);
            }
        } else {
            ctx.beginPath();
            ctx.moveTo((scaleMinDistLeft * proportion) / 2, scaleX * proportion);
            ctx.lineTo(scaleMinDistLeft * proportion, scaleX * proportion);
            ctx.closePath();
            ctx.stroke();
        }
        scaleX -= scaleSpacing;
        i += scaleSpacing;
    }

    var scaleY = scaleMinDistLeft;
    i = 0;
    while (i < glassWidth - scaleSpacing) {
        if (i % scaleSpacingText == 0) {
            ctx.beginPath();
            ctx.moveTo(scaleY * proportion, glassHeight * proportion);
            ctx.lineTo(scaleY * proportion, (glassHeight + scaleMinDistButton) * proportion);
            ctx.closePath();
            ctx.stroke();
            if (i > 0) {
                ctx.fillText(i, ((scaleY - fontPadding) * proportion) - ctx.measureText(i).width, (glassHeight + scaleMinDistButton) * proportion);
            }
        } else {
            ctx.beginPath();
            ctx.moveTo(scaleY * proportion, glassHeight * proportion);
            ctx.lineTo(scaleY * proportion, (glassHeight + (scaleMinDistButton / 3)) * proportion);
            ctx.closePath();
            ctx.stroke();
        }


        scaleY += scaleSpacing;
        i += scaleSpacing;
    }

    ctx.lineWidth = 3;

    //typ, bodX, bodY
    if (json != null) {
        for (var i = 0; i < json.defects.length; i++) {
            switch (json.defects[i].Type) {
                case 'DEFS': 	//plocha 
                    if (i + 1 == json.defects.length) {
                        ctx.fillStyle = "#7F00FF";
                    } else {
                        ctx.fillStyle = "#F0AD4E";
                    }

                    ctx.beginPath();
                    ctx.fillRect((scaleMinDistLeft + json.defects[i].PointBX) * proportion, ((glassHeight - json.defects[i].PointBY) - (json.defects[i].PointAY - json.defects[i].PointBY)) * proportion,
                        (json.defects[i].PointAX - json.defects[i].PointBX) * proportion, (json.defects[i].PointAY - json.defects[i].PointBY) * proportion);
                    ctx.closePath();
                    break;
                case 'DEFP': 	//bod
                    continue;
                    break;
                case 'DEFT': 	//hrana
                    if (i + 1 == json.defects.length) {
                        ctx.fillStyle = "#7F00FF";
                    } else {
                        ctx.fillStyle = "#3333FF";
                    }
                    ctx.beginPath();
                    ctx.fillRect((scaleMinDistLeft + json.defects[i].PointAX) * proportion, (glassHeight - json.defects[i].PointAY) * proportion,
                        (json.defects[i].PointBX - json.defects[i].PointAX) * proportion, (json.defects[i].PointAY - json.defects[i].PointBY) * proportion);
                    ctx.closePath();
                    break;
            }
        }

        for (var i = 0; i < json.defects.length; i++) {
            if (json.defects[i].Type == 'DEFP') {
                if (i + 1 == json.defects.length) {
                    ctx.strokeStyle = "#7F00FF";
                } else {
                    ctx.strokeStyle = "#FF3333";
                }
                ctx.beginPath();
                ctx.moveTo((json.defects[i].PointAX - pointSize + scaleMinDistLeft) * proportion, (glassHeight - (json.defects[i].PointAY - pointSize)) * proportion);
                ctx.lineTo((json.defects[i].PointAX + pointSize + scaleMinDistLeft) * proportion, (glassHeight - (json.defects[i].PointAY + pointSize)) * proportion);
                ctx.closePath();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo((json.defects[i].PointAX + pointSize + scaleMinDistLeft) * proportion, (glassHeight - (json.defects[i].PointAY - pointSize)) * proportion);
                ctx.lineTo((json.defects[i].PointAX - pointSize + scaleMinDistLeft) * proportion, (glassHeight - (json.defects[i].PointAY + pointSize)) * proportion);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}


function createDeformation(deformation) {
    if (json != null && json.glass != null && json.glass.IdGlass != null) {
        var def = JSON.parse(deformation);
        def.GlassId = json.glass.IdGlass;
        def.DefectOrder = json.defects[json.defects.length - 1].DefectOrder + 1;
        json.defects.push(def);
        repaintObjects();
        var jsonToSend = JSON.stringify(def);
        return jsonToSend;
    }
    return null;
}

function createGlass(glass) {
    json = JSON.parse(glass);
    if (json.glass.ControlDate == null) {
        document.getElementById("dateOfControl").value = ""
    } else {
        document.getElementById("dateOfControl").value = json.glass.ControlDate;
    }
    if (json.glass.Code == null) {
        document.getElementById("code").value = ""
    } else {
        document.getElementById("code").value = json.glass.Code;
    }
    if (json.glass.PackNum == null) {
        document.getElementById("packNum").value = ""
    } else {
        document.getElementById("packNum").value = json.glass.PackNum;
    }
    if (json.glass.DedArea == null) {
        document.getElementById("dedArea").value = ""
    } else {
        document.getElementById("dedArea").value = json.glass.DedArea;
    }
    if (json.glass.Quality == null) {
        document.getElementById("quality").value = ""
    } else {
        document.getElementById("quality").value = json.glass.Quality;
    }
    document.getElementById("serialNum").value = json.glass.SerialNum;
    document.getElementById("width").value = json.glass.Width;
    document.getElementById("height").value = json.glass.Height;

    repaintObjects();
}

function deleteLastData() {
    var lastDef = JSON.stringify(json.defects[json.defects.length - 1]);
    json.defects.splice(json.defects.length - 1);
    repaintObjects();
    return lastDef;
}


function showSuccesMessage() {
    document.getElementById("successModalMessage").style.display = "block";
    setTimeout(() => {
        document.getElementById("successModalMessage").style.display = "none";
    }, 10000);
}

function AddPackNum(packNum) {
    if (json != null && json.glass != null && json.glass.IdGlass != null) {
        document.getElementById("packNum").value = packNum;
        json.glass.PackNum = packNum;
        return JSON.stringify(json.glass);
    }
    return null;
}

function AddPackNum(packNum) {
    if (json != null && json.glass != null && json.glass.IdGlass != null) {
        document.getElementById("packNum").value = packNum;
        json.glass.PackNum = packNum;
        return JSON.stringify(json.glass);
    }
    return null;
}

function AddCode(code) {
    if (json != null && json.glass != null && json.glass.IdGlass != null) {
        document.getElementById("code").value = code;
        json.glass.Code = code;
        return JSON.stringify(json.glass);
    }
    return null;
}

function resetAllGlass() {
    document.getElementById("dateOfControl").value = ""
    document.getElementById("code").value = ""
    document.getElementById("packNum").value = ""
    document.getElementById("dedArea").value = ""
    document.getElementById("quality").value = ""
    document.getElementById("serialNum").value = ""
    document.getElementById("width").value = "";
    document.getElementById("height").value = "";

    json = null;
    repaintObjects();
}