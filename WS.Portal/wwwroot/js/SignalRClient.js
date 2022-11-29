const connection = new signalR.HubConnectionBuilder()
    .withUrl("/visualizationHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

async function computeGlass(packNum, code) {
    await connection.invoke('ComputeGlass', packNum, code);
}

async function getGlassBySerNum(serNum) {
    await connection.invoke('GetGlassBySerNum', serNum);
}

async function resetAll() {
    await connection.invoke('ResetAll');
}

connection.onclose(async () => {
    await start();
});

start();

connection.on("SendCoordinates", async (def) => {
    var defect = createDeformation(def);
    var result = await connection.invoke("SaveDeformation", defect);
});

connection.on("CreateGlass", (glass) => {
    createGlass(glass);
});

connection.on("DeleteLastDefect", async () => {
    var defect = deleteLastData();
    var result = await connection.invoke("RemoveDefect", defect);
})

connection.on("Error", () => {
    showError();
})

connection.on("ErrorMessage", (message) => {
    showErrorMessage(message);
})

connection.on("SendPackNum", async (packNum) => {
    var glass = AddPackNum(packNum);
    var result = await connection.invoke("SavePackNum", glass);
})

connection.on("SendCode", async (code) => {
    var glass = AddCode(code);
    var result = await connection.invoke("SaveCode", glass);
})

connection.on("getName", async () => {
    var result = await connection.invoke("AddWithName", "visu");
})