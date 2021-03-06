'use strict'
/**
* @author Sambit Sahoo <soulsam480@hotmail.com>
* @version 0.1.0
*/

import { app, protocol, BrowserWindow, ipcMain, remote, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import path from 'path'
import fs from 'fs'
declare const __static: string;
// import img from './assets/download.jpeg';
import { testHtml, templateKwitansi, templateKwitansiItems, templateReport, templateReportItems } from './template'
/* import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
 */const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {

  const config = {
    logo: '',
    schoolName: '',
    autoBackup: false,
    backupEvery: 'transaction',
    hostBackup: 'http://localhost:3000',
    shouldLogin: false, // change value to true, to force login on everytime open the app
    // shouldLogin: true, // change value to true, to force login on everytime open the app
  }

  if (!fs.existsSync(`${app.getPath("userData")}/config.json`)) {
    fs.writeFileSync(`${app.getPath("userData")}/config.json`, JSON.stringify(config))
  }

  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron  6/7/<8.25 on Windows
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment the following lines (and the import at the top of the file)
    // In addition, if you upgrade to Electron ^8.2.5 or ^9.0.0 then devtools should work fine

    /*  try {
       await installExtension(VUEJS_DEVTOOLS)
     } catch (e) {
       console.error('Vue Devtools failed to install:', e.toString())
     } */

  }

  fs.copyFile(path.join(__static, "/images/download.jpeg"), path.join(app.getPath("userData"), "logo.jpeg"), function (err: any) {
    if (err) {
      console.log(path.join(__static, "/images/download.jpeg"));
      console.log(path.join(app.getPath('exe'), "download.jpeg"));
      console.log(err);
    } else {
      // fs.unlinkSync(htmlPath)
      console.log('Successfully');
    }
  });
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

const options2 = {
  marginsType: 1,
  pageSize: 'A4',
  printBackground: true,
  printSelectionOnly: false,
  landscape: false
}

const options = {
  marginsType: 1,
  pageSize: 'A5',
  printBackground: true,
  printSelectionOnly: false,
  landscape: true
}
ipcMain.on('print-pdf', async (event, payload) => {
  const htmlPath = path.join(app.getPath("userData"), "test.html")
  const filePath = path.join(app.getPath("userData"), "test.pdf")
  const wind = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const rawData = fs.readFileSync(`${app.getPath("userData")}/config.json`, { encoding: 'utf8', flag: 'r' })
  const data = JSON.parse(rawData)
  console.log(`${app.getPath("userData")}/config.json`);
  console.log(data);

  let template = templateKwitansi
  let itemsTemplate = ''

  for (const idx in payload.payload.items) {
    let itemsTemplateTmp = templateKwitansiItems
    itemsTemplateTmp = itemsTemplateTmp.replace('{{jenis}}', payload.payload.items[idx].jenis)
    itemsTemplateTmp = itemsTemplateTmp.replace('{{harga}}', payload.payload.items[idx].harga)
    itemsTemplate = itemsTemplate.concat(itemsTemplateTmp)
  }
  const now = new Date()

  template = template.replace('{{logo}}', data.logo)
  template = template.replace('{{schoolName}}', data.schoolName)
  template = template.replace('{{tanggalDibuat}}', payload.payload.tanggalDibuat)
  template = template.replace('{{nama}}', payload.payload.nama)
  template = template.replace('{{kelas}}', payload.payload.kelas)
  template = template.replace('{{tahun}}', payload.payload.tahun)
  template = template.replace('{{items}}', itemsTemplate)
  template = template.replace('{{total}}', payload.payload.total)

  await fs.writeFileSync(htmlPath, template);

  wind.loadURL(`file://${htmlPath}`);


  wind.webContents.on('did-finish-load', () => {
    wind.webContents.printToPDF(options).then(data => {
      fs.writeFile(filePath, data, function (err: any) {
        if (err) {
          console.log(err);
        } else {
          // fs.unlinkSync(htmlPath)
          dialog.showSaveDialog({
            title: "Select the File Path to save",
            defaultPath: path.join(app.getPath('documents'), `Struk-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getTime()}.pdf`),
            // defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: "Save",
            // Restricting the user to only Text Files.
            filters: [
              {
                name: "Document",
                extensions: ["pdf"],
              },
            ],
            // properties: [],
          }).then((file) => {
            // Stating whether dialog operation was cancelled or not.
            console.log(file.canceled);
            if (!file.canceled) {
              console.log(file.filePath!.toString());

              // Creating and Writing to the sample.txt file
              fs.copyFileSync(
                filePath,
                file.filePath!.toString()
              );
              fs.unlinkSync(filePath)
            }
          })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }).catch(error => {
      console.log(error)
    });
  });
  event.returnValue = true
})

ipcMain.on('print-report', async (event, payload) => {
  const htmlPath = path.join(app.getPath("userData"), "report.html")
  const filePath = path.join(app.getPath("userData"), "report.pdf")
  const wind = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  const rawData = fs.readFileSync(`${app.getPath("userData")}/config.json`, { encoding: 'utf8', flag: 'r' })
  const now = new Date()

  const data = JSON.parse(rawData)
  console.log(`${app.getPath("userData")}/config.json`);
  console.log(data);
  let template = templateReport
  let itemsTemplate = ''

  for (const idx in payload.payload.items) {
    let itemsTemplateTmp = templateReportItems
    itemsTemplateTmp = itemsTemplateTmp.replace('{{id}}', payload.payload.items[idx].id)
    itemsTemplateTmp = itemsTemplateTmp.replace('{{jenis}}', payload.payload.items[idx].jenis)
    itemsTemplateTmp = itemsTemplateTmp.replace('{{nama}}', payload.payload.items[idx].nama)
    itemsTemplateTmp = itemsTemplateTmp.replace('{{kelas}}', payload.payload.items[idx].kelas)
    itemsTemplateTmp = itemsTemplateTmp.replace('{{bayar}}', payload.payload.items[idx].bayar)
    itemsTemplateTmp = itemsTemplateTmp.replace('{{deskripsi}}', payload.payload.items[idx].deskripsi)
    itemsTemplate = itemsTemplate.concat(itemsTemplateTmp)
  }

  template = template.replace('{{logo}}', data.logo)
  template = template.replace('{{schoolName}}', data.schoolName)
  template = template.replace('{{createdAt}}', payload.payload.createdAt)
  template = template.replace('{{reportType}}', payload.payload.reportType)
  template = template.replace('{{dateStart}}', payload.payload.dateStart)
  template = template.replace('{{dateEnd}}', payload.payload.dateEnd)
  template = template.replace('{{items}}', itemsTemplate)
  // template = template.replace('{{total}}', payload.payload.total)

  await fs.writeFileSync(htmlPath, template);

  wind.loadURL(`file://${htmlPath}`);


  wind.webContents.on('did-finish-load', () => {
    wind.webContents.printToPDF(options2).then(data => {
      fs.writeFile(filePath, data, function (err: any) {
        if (err) {
          console.log(err);
        } else {
          // fs.unlinkSync(htmlPath)
          dialog.showSaveDialog({
            title: "Select the File Path to save",
            defaultPath: path.join(app.getPath('documents'), `Laporan-${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getTime()}.pdf`),
            // defaultPath: path.join(__dirname, '../assets/'),
            buttonLabel: "Save",
            // Restricting the user to only Text Files.
            filters: [
              {
                name: "Document",
                extensions: ["pdf"],
              },
            ],
            // properties: [],
          }).then((file) => {
            // Stating whether dialog operation was cancelled or not.
            console.log(file.canceled);
            if (!file.canceled) {
              console.log(file.filePath!.toString());

              // Creating and Writing to the sample.txt file
              fs.copyFileSync(
                filePath,
                file.filePath!.toString()
              );
              fs.unlinkSync(filePath)
            }
          })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }).catch(error => {
      console.log(error)
    });
  });
  event.returnValue = true
})

ipcMain.on('do-save-backup', async (event, payload) => {
  const filePath = path.join(app.getPath("userData"), "backup.txt")

  await fs.writeFileSync(filePath, payload);


  dialog.showSaveDialog({
    title: "Select the File Path to save",
    defaultPath: path.join(app.getPath('documents'), "Contoh backup.txt"),
    // defaultPath: path.join(__dirname, '../assets/'),
    buttonLabel: "Save",
    // Restricting the user to only Text Files.
    filters: [
      {
        name: "Document",
        extensions: ["txt"],
      },
    ],
    // properties: [],
  }).then((file) => {
    // Stating whether dialog operation was cancelled or not.
    console.log(file.canceled);
    if (!file.canceled) {
      console.log(file.filePath!.toString());

      // Creating and Writing to the sample.txt file
      fs.copyFileSync(
        filePath,
        file.filePath!.toString()
      );
      fs.unlinkSync(filePath)
    }
  })
    .catch((err) => {
      console.log(err);
    });

  event.returnValue = true
})

ipcMain.on('ping', event => {
  console.log('pong')
  const win = BrowserWindow.getFocusedWindow()
  dialog.showMessageBox(win!, { message: "test" })
  // Send reply to a renderer
  event.returnValue = 'pong'
})

ipcMain.on('get-root-path', event => {
  event.returnValue = app.getPath('userData')
})
