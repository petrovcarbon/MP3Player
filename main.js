const electron=require('electron')

const {app, BrowserWindow, ipcMain} = electron
let win

app.on('ready',()=>{
    win = new BrowserWindow({
        icon:'assets/DVDlogo.jpg',
        frame: false, /*disable windows frame*/
        maximizable: false, /*disable maximize*/
        height: 700,
        width: 400,
        transparent: true,  /* removing the bg to round the corners of the app*/
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.loadFile('index.html')
    win.setResizable(false) /*disable resizing*/

    ipcMain.on('closeApp', ()=> {
        win.close()
    })
    ipcMain.on('minApp', ()=>{
        win.minimize()
    })
    
});
