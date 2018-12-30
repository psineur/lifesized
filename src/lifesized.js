/**
 * lifesized: Get the physical size of displays and their ppi
 */

var electron = require('electron'),
    execSync = require('child_process').execSync,
    exec = require('child_process').exec,
    path = require('path'),
    os = require('os');

var fs = require('fs');

var lifesized = {

    /**
     * Get the pixels per inch of a screen
     *
     * @param [display] (Electron Screen Instance) If not provided the display
              this process' BrowserWindow' is over will be used
     */
    ppi: function(display){
        display = display || getBrowserWindowDisplay();
        return getPPI(display);
    },

    /**
     * Get the pixels per inch of a screen
     *
     * @param objectRealSize (Number) Real size of an object in inches
     * @param objectPixelSize (Number) Size of the object in an image in pixels
     * @param [display] (Electron Screen Instance) If not provided the display
              this process' BrowserWindow' is over will be used
     */
    scale: function(objectRealSize, objectPixelSize, display){
        var ppi = lifesized.ppi(display);
        return objectRealSize*ppi/objectPixelSize;
    }
};

/**
 * Get the display that the window is mostly over
 */
function getBrowserWindowDisplay(){
    // Don't require remote unless we hit here as it can't be required in the
    // main process.
    return electron.screen.getDisplayMatching(electron.remote.getCurrentWindow().getBounds());
}

/**
 * Get a screens PPI
 */
function getPPI(display){

    let appPath = electron.remote.app.getAppPath();
    let unpackedPath = appPath.replace('app.asar', 'app.asar.unpacked');
    if (fs.existsSync(unpackedPath)) {
      appPath = unpackedPath;
    }

    let command = appPath + "/node_modules/lifesized/build/lifesized-cli/Build/Products/Debug/lifesized-cli") + " " + display.id;

    if(os.platform() === "darwin"){
        try {
            return parseFloat(execSync(command));
        } catch (err) {
            console.error(err);
            return 72.0;
        }
    } else {
        return 72.0;
    }
}

module.exports = lifesized;
