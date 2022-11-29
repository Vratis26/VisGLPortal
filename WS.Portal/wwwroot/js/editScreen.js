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
var fontSize = 50;
var fontPadding = 10;
var scaleLineLength = 20;
var scaleMinDistLeft = 120;
var scaleMinDistButton = 60;
var scaleSpacingText = 200;
var scaleSpacing = 100;
var touch = false;
var highLight = [];
var pointMove = [];
//typ, bodX (x, y), bodY (x, y)
//typ - DEFS - plocha; DEFP - bod; DEFT - hrana
var points = [];
var pointSize = 20;
var circleSize = 15;
var edgeSize = 24;
var deleteComponent = false;
var addPointSet = false;
var addEdgeSet = false;
var addAreaSet = false;
var glassOrder = 0;
var profit = [];
var isCoordinateModalShown = false;
var coordinateModalMoved = 10;
var showCoordinatesModalAdd = false;
var json;

window.onload = function () {
    windowWidth = document.getElementById("main-content-wrapper-src").clientWidth;

    windowWidth -= 48;

    windowHeight = ((windowWidth / 16) * 9) * 0.90;
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

    document.getElementById("src").addEventListener("mousedown", mouseDownListener);
    document.getElementById("src").addEventListener("mousemove", mouseMovedListener);
    document.getElementById("src").addEventListener("mouseup", mouseUpListener);
    document.getElementById("deleteButtonTop").addEventListener("click", deleteTop);
    document.getElementById("deleteButtonBottom").addEventListener("click", deleteTop);
    window.addEventListener("keydown", keyDown);
    document.getElementById("addPointTop").addEventListener("click", addPoint);
    document.getElementById("addPointBottom").addEventListener("click", addPoint);
    document.getElementById("addAreaTop").addEventListener("click", addArea);
    document.getElementById("addAreaBottom").addEventListener("click", addArea);
    document.getElementById("addEdgeTop").addEventListener("click", addEdge);
    document.getElementById("addEdgeBottom").addEventListener("click", addEdge);
}

window.onresize = function () {
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
    for (var i = json.defects.length - 1; i >= 0; i--) {
        switch (json.defects[i].Type) {
            case 'DEFS': 	//plocha 
                if (highLight[0] == i && highLight[1] == 0) {
                    ctx.fillStyle = "#33FF33";
                } else if (i + 1 == json.defects.length && pointA[0] == -1) {
                    ctx.fillStyle = "#7F00FF";
                } else {
                    ctx.fillStyle = "#F0AD4E";
                }

                if (highLight[0] == i && highLight[1] == 1) {
                    ctx.fillStyle = "#33FF33";
                    ctx.beginPath();
                    ctx.arc((scaleMinDistLeft + json.defects[i].PointAX) * proportion, ((glassHeight - json.defects[i].PointBY) - (json.defects[i].PointAY - json.defects[i].PointBY)) * proportion, circleSize * proportion, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = "#F0AD4E";
                } else if (highLight[0] == i && highLight[1] == 2) {
                    ctx.fillStyle = "#33FF33";
                    ctx.beginPath();
                    ctx.arc((scaleMinDistLeft + json.defects[i].PointBX) * proportion, ((glassHeight - json.defects[i].PointBY)) * proportion, circleSize * proportion, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();
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
                if (highLight[0] == i) {
                    ctx.fillStyle = "#33FF33";
                } else if (i + 1 == json.defects.length && pointA[0] == -1) {
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

    for (var i = json.defects.length - 1; i >= 0; i--) {
        if (json.defects[i].Type == 'DEFP') {
            if (highLight[0] == i) {
                ctx.strokeStyle = "#33FF33";
            } else if (i + 1 == json.defects.length && pointA[0] == -1) {
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

    if (pointA[0] != -1) {
        ctx.fillStyle = "#7F00FF";
        ctx.beginPath();
        ctx.fillRect((scaleMinDistLeft + pointB[0]) * proportion, ((glassHeight - pointB[1]) - (pointA[1] - pointB[1])) * proportion,
            (pointA[0] - pointB[0]) * proportion, (pointA[1] - pointB[1]) * proportion);
        ctx.closePath();
    }
    if (profit.length > 0) {
        ctx.strokeStyle = "#000000";
        ctx.beginPath();
        ctx.strokeRect((scaleMinDistLeft + profit[1][0]) * proportion, ((glassHeight - profit[1][1]) - (profit[0][1] - profit[1][1])) * proportion,
            (profit[0][0] - profit[1][0]) * proportion, (profit[0][1] - profit[1][1]) * proportion);
        ctx.closePath();
    }
}

function mouseDownListener(event) {
    mouseDown = true;
}

function mouseMovedListener(event) {
    if (showCoordinatesModalAdd == true) {
        showCoordinatesModalAdding(event.clientX, event.clientY);
    }

    if (mouseDown) {
        if (mouseMoved) {
            if (pointMove != null) {
                setChangeCoordinates(event.clientX, event.clientY);
            }
        } else {
            mouseMoved = true;
            pointMove = highLightObject(event.clientX, event.clientY, 1);
            repaintObjects();
        }
    } else if (pointA[0] != -1) {
        pointB = computeXY(event.clientX, event.clientY);
        repaintObjects();
    } else {
        highLight = highLightObject(event.clientX, event.clientY, 0);
        repaintObjects();
    }
}

function mouseUpListener(event) {
    mouseDown = false;
    if (mouseMoved) {

        if (lineMove != null) {
            setChangeCoordinates(event.clientX, event.clientY);
            lineMove = null;
        }
        mouseMoved = false;
    } else {
        printMousePos(event.clientX, event.clientY);
    }
    pointMove = [];
}

function deleteTop() {
    if (!deleteComponent) {
        deleteComponent = true;
        var elm = document.getElementById("deleteButtonBottom");
        elm.classList.add("active");
        elm = document.getElementById("deleteButtonTop");
        elm.classList.add("active");
    } else {
        deleteComponent = false;
        var elm = document.getElementById("deleteButtonBottom");
        elm.classList.remove("active");
        elm = document.getElementById("deleteButtonTop");
        elm.classList.remove("active");
    }
}

function addPoint() {
    if (!addPointSet) {
        addPointSet = true;
        var elm = document.getElementById("addPointTop");
        elm.classList.add("active");
        elm = document.getElementById("addPointBottom");
        elm.classList.add("active");
        showCoordinatesModalAdd = true;
    } else {
        closeCoordinatesModal();
        addPointSet = false;
        var elm = document.getElementById("addPointTop");
        elm.classList.remove("active");
        elm = document.getElementById("addPointBottom");
        elm.classList.remove("active");
        showCoordinatesModalAdd = false;
    }
}

function addEdge() {
    if (!addEdgeSet) {
        addEdgeSet = true;
        var elm = document.getElementById("addEdgeTop");
        elm.classList.add("active");
        elm = document.getElementById("addEdgeBottom");
        elm.classList.add("active");
        showCoordinatesModalAdd = true;
    } else {
        closeCoordinatesModal();
        addEdgeSet = false;
        var elm = document.getElementById("addEdgeTop");
        elm.classList.remove("active");
        elm = document.getElementById("addEdgeBottom");
        elm.classList.remove("active");
        showCoordinatesModalAdd = false;
    }
}

function addArea() {
    if (!addAreaSet) {
        addAreaSet = true;
        var elm = document.getElementById("addAreaTop");
        elm.classList.add("active");
        elm = document.getElementById("addAreaBottom");
        elm.classList.add("active");
        showCoordinatesModalAdd = true;
    } else {
        closeCoordinatesModal();
        addAreaSet = false;
        var elm = document.getElementById("addAreaTop");
        elm.classList.remove("active");
        elm = document.getElementById("addAreaBottom");
        elm.classList.remove("active");
        showCoordinatesModalAdd = false
    }
}

function highLightObject(x, y, saveAs) {
    var origX = x;
    var origY = y;
    [x, y] = computeXY(x, y);

    for (var i = 0; i < json.defects.length; i++) {
        switch (json.defects[i].Type) {
            case 'DEFP':
                if (x >= json.defects[i].PointAX - pointSize && x <= json.defects[i].PointAX + pointSize &&
                    y >= json.defects[i].PointAY - pointSize && y <= json.defects[i].PointAY + pointSize) {
                    showCoordinatesModal(i, origX, origY);
                    return [i, 0, x, y];
                }
                break;
            case 'DEFT':
                if (x >= json.defects[i].PointAX && x <= json.defects[i].PointBX &&
                    y >= json.defects[i].PointAY && y <= json.defects[i].PointBY) {
                    showCoordinatesModal(i, origX, origY);
                    return [i, 0, x, y];
                }
                break;
            case 'DEFS':
                if (x >= json.defects[i].PointAX - pointSize && x <= json.defects[i].PointAX + pointSize &&
                    y >= json.defects[i].PointAY - pointSize && y <= json.defects[i].PointAY + pointSize) {
                    showCoordinatesModal(i, origX, origY);
                    return [i, 1, x, y];
                }
                if (x >= json.defects[i].PointBX - pointSize && x <= json.defects[i].PointBX + pointSize &&
                    y >= json.defects[i].PointBY - pointSize && y <= json.defects[i].PointBY + pointSize) {
                    showCoordinatesModal(i, origX, origY);
                    return [i, 2, x, y];
                }
                if (x >= json.defects[i].PointAX && x <= json.defects[i].PointBX &&
                    y >= json.defects[i].PointAY && y <= json.defects[i].PointBY) {
                    showCoordinatesModal(i, origX, origY);
                    return [i, 0, x, y];
                }
                break;
        }
    }
    if (isCoordinateModalShown == true) {
        closeCoordinatesModal();
    }
    return [];
}

function closeCoordinatesModal() {
    isCoordinateModalShown = false;
    showCoordinatesModalAdd = false;
    document.getElementById("coordinateModal").style.display = "none";
}

function showCoordinatesModal(i, origX, origY) {
    if (showCoordinatesModalAdd == false) {
        isCoordinateModalShown = true;
        var a = document.getElementById("coordinateModal");
        a.style.display = "block";
        a.style.left = (origX + coordinateModalMoved) + "px";
        a.style.top = (origY + coordinateModalMoved) + "px";
        if (json.defects[i].Type == 'DEFP') {
            document.getElementById("coordinateModelText").innerHTML = "A[" + json.defects[i].PointAX + " mm; " + json.defects[i].PointAY + " mm]";
        } else {
            document.getElementById("coordinateModelText").innerHTML = "A[" + json.defects[i].PointAX + " mm; " + json.defects[i].PointAX + " mm]<br />B[" + json.defects[i].PointBX + " mm; " + json.defects[i].PointBY + " mm]";
        }
    }
}

function showCoordinatesModalAdding(origX, origY) {
    [x, y] = computeXY(origX, origY);
    var a = document.getElementById("coordinateModal");
    a.style.display = "block";
    a.style.left = (origX + coordinateModalMoved) + "px";
    a.style.top = (origY + coordinateModalMoved) + "px";
    document.getElementById("coordinateModelText").innerHTML = "A[" + Math.round(x) + " mm; " + Math.round(y) + " mm]";
}

function setChangeCoordinates(x, y) {
    var origX = x;
    var origY = y;
    [x, y] = computeXY(x, y);

    var moveX = Math.round(x - pointMove[2]);
    var moveY = Math.round(y - pointMove[3]);
    switch (json.defects[pointMove[0]].Type) {
        case 'DEFP':
            json.defects[pointMove[0]].PointAX += moveX;
            json.defects[pointMove[0]].PointAY += moveY;
            break;
        case 'DEFS':
            switch (pointMove[1]) {
                case 0:
                    json.defects[pointMove[0]].PointAX += moveX;
                    json.defects[pointMove[0]].PointAY += moveY;
                    json.defects[pointMove[0]].PointBX += moveX;
                    json.defects[pointMove[0]].PointBY += moveY;
                    break;
                case 1:
                    json.defects[pointMove[0]].PointAX += moveX;
                    json.defects[pointMove[0]].PointAY += moveY;
                    break;
                case 2:
                    json.defects[pointMove[0]].PointBX += moveX;
                    json.defects[pointMove[0]].PointBY += moveY;
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    pointMove[2] += moveX;
    pointMove[3] += moveY;
    showCoordinatesModal(pointMove[0], origX, origY);
    repaintObjects();
}

function keyDown(event) {

    switch (event.keyCode) {
        case 46:
            if (highLight.length > 0) {
                deleteFun(highLight);
                repaintObjects();
                highLight = [];
            }
            break;
        case 80:
            addPoint();
            break;
        case 83:
            addArea();
            break;
        case 84:
            addEdge();
            break;
        default:
            break;
    }
}

function printMousePos(x, y) {
    if (deleteComponent) {
        var del = highLightObject(x, y);
        console.log(del);
        closeCoordinatesModal();
        deleteFun(del);
        repaintObjects();
        deleteTop();
    } else if (addPointSet) {
        addPointToGlass(x, y);
    } else if (addAreaSet) {
        if (pointA[0] == -1) {
            [x, y] = computeXY(x, y);
            pointA = [x, y];
        } else {
            addAreaToGlass(x, y);
            pointA = [-1, -1]
        }
    } else if (addEdgeSet) {
        addEdgeToGlass(x, y);
    }
}

function deleteFun(del) {
    if (del.length > 0) {
        json.defects.splice(del[0], 1);
    }
}

function computeXY(x, y) {
    var offsetHeight = document.getElementById("src").offsetTop;
    var offsetWeight = document.getElementById("src").offsetLeft;
    var offsetWeightScroll = window.pageXOffset;
    var offsetHeightScroll = window.pageYOffset;

    x = (((x - offsetWeight + offsetWeightScroll) - (scaleMinDistLeft * proportion)) / (glassWidth * proportion)) * glassWidth;
    y = (glassHeight - scaleMinDistButton) - ((((y - offsetHeight + offsetHeightScroll) - (scaleMinDistButton * proportion)) / (glassHeight * proportion)) * glassHeight);

    return [x, y];
}

function addPointToGlass(x, y) {
    [x, y] = computeXY(x, y);
    x = parseInt(x);
    y = parseInt(y);

    json.defects.push({"Type": 'DEFP', "GlassId": json.glass.IdGlass, "PointAX": x, "PointAY": y, "PointBX": null, "PointBY": null, "IdDefect": null, "DefectOrder": glassOrder});
    glassOrder++;
    repaintObjects();
    addPoint();
}

function addAreaToGlass(x, y) {
    [x, y] = computeXY(x, y);
    x = parseInt(x);
    y = parseInt(y);
    pointA[0] = parseInt(pointA[0]);
    pointA[1] = parseInt(pointA[1]);

    if (pointA[0] < x) {
        if (pointA[1] < y) {
            json.defects.push({ "Type": 'DEFS', "GlassId": json.glass.IdGlass, "PointAX": pointA[0], "PointAY": pointA[1], "PointBX": x, "PointBY": y, "IdDefect": null, "DefectOrder": glassOrder });
        } else {
            json.defects.push({ "Type": 'DEFS', "GlassId": json.glass.IdGlass, "PointAX": pointA[0], "PointAY": y, "PointBX": x, "PointBY": pointA[1], "IdDefect": null, "DefectOrder": glassOrder });
        }
    } else {
        if (pointA[1] < y) {
            json.defects.push({ "Type": 'DEFS', "GlassId": json.glass.IdGlass, "PointAX": x, "PointAY": pointA[1], "PointBX": pointA[0], "PointBY": y, "IdDefect": null, "DefectOrder": glassOrder });
        } else {
            json.defects.push({ "Type": 'DEFS', "GlassId": json.glass.IdGlass, "PointAX": x, "PointAY": y, "PointBX": pointA[0], "PointBY": pointA[1], "IdDefect": null, "DefectOrder": glassOrder });
        }
    }
    glassOrder++;
    repaintObjects();
    addArea();
}

function addEdgeToGlass(x, y) {
    [x, y] = computeXY(x, y);
    x = parseInt(x);
    y = parseInt(y);
    var middle = [glassWidth / 2, glassHeight / 2];
    switch (getNeerestSide(x, y)) {
        case 0:
            json.defects.push({ "Type": 'DEFT', "GlassId": json.glass.IdGlass, "PointAX": 0, "PointAY": 0, "PointBX": glassWidth, "PointBY": y, "IdDefect": null, "DefectOrder": glassOrder });
            break;
        case 1:
            json.defects.push({ "Type": 'DEFT', "GlassId": json.glass.IdGlass, "PointAX": 0, "PointAY": y, "PointBX": glassWidth, "PointBY": glassHeight, "IdDefect": null, "DefectOrder": glassOrder });
            break;
        case 2:
            json.defects.push({ "Type": 'DEFT', "GlassId": json.glass.IdGlass, "PointAX": 0, "PointAY": 0, "PointBX": x, "PointBY": glassHeight, "IdDefect": null, "DefectOrder": glassOrder });
            break;
        case 3:
            json.defects.push({ "Type": 'DEFT', "GlassId": json.glass.IdGlass, "PointAX": x, "PointAY": 0, "PointBX": glassWidth, "PointBY": glassHeight, "IdDefect": null, "DefectOrder": glassOrder });

            break;
        default:
            break;
    }
    glassOrder++;
    repaintObjects();
    addEdge();
}

function getNeerestSide(x, y) {
    var dist = [];
    var aBottom = (0 - 0) / (glassWidth - 0);
    var cBottom = (0 - (aBottom * glassWidth));

    dist.push((Math.abs(aBottom * x - y + cBottom) / Math.sqrt(aBottom * aBottom + 1)));

    var aTop = (glassHeight - glassHeight) / (glassWidth - 0);
    var cTop = (glassHeight - (aTop * glassWidth));

    dist.push((Math.abs(aTop * x - y + cTop) / Math.sqrt(aTop * aTop + 1)));

    var aLeft = (glassHeight - 0) / (1 - 0);
    var cLeft = (glassHeight - (aLeft * 0));

    dist.push((Math.abs(aLeft * x - y + cLeft) / Math.sqrt(aLeft * aLeft + 1)));

    var aRight = (glassHeight - 0) / (windowWidth - windowWidth + 1);
    var cRight = (glassHeight - (aRight * glassWidth));

    dist.push((Math.abs(aRight * x - y + cRight) / Math.sqrt(aRight * aRight + 1)));

    var index = 0
    for (var i = 1; i < dist.length; i++) {
        if (dist[i] < dist[index]) {
            index = i;
        }
    }
    return index;
}