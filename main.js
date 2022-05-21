const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
  shell,
} = require("electron");
const path = require("path");
const os = require("os");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const slash = require("slash");
const log = require("electron-log");

// find the enviornment we are working in.
process.env.NODE_ENV = "production";
const isDev = process.env.NODE_ENV !== "production" ? true : false;

// find the platform we are using.
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: isDev ? 800 : 500,
    height: 600,
    // cannot be relative, must be absolute path
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    // if we are in dev, we want to be able to resize the window.
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // some css
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.loadFile("./app/index.html");
};
const createAboutWindow = () => {
  aboutWindow = new BrowserWindow({
    title: "About Image Shrink",
    width: 300,
    height: 300,
    // cannot be relative, must be absolute path
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    // if we are in dev, we want to be able to resize the window.
    resizable: false,
    // some css
  });

  aboutWindow.loadFile("./app/about.html");
};
const menu = [
  // checks for mac
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: "About",
              click: () => createAboutWindow(),
            },
          ],
        },
      ]
    : []),
  {
    role: "fileMenu",
  },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [
            {
              label: "About",
              click: () => createAboutWindow(),
            },
          ],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

// Catch event
ipcMain.on("image:minimize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageshink");
  shrinkImage(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQuality, pngQuality],
        }),
      ],
    });
    log.info(files);
    shell.openPath(dest);
    mainWindow.webContents.send("image:done");
  } catch (error) {
    console.log(error);
    log.error(error);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createMainWindow();
  Menu.setApplicationMenu(Menu.buildFromTemplate(menu));
  mainWindow.on("ready", () => (mainWindow = null));

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
