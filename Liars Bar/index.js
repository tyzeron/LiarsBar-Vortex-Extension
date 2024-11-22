
// https://www.nexusmods.com/liarsbar
const GAME_ID = 'liarsbar';

// https://steamdb.info/app/3097560/
const STEAMAPP_ID = '3097560';

// Import some assets from Vortex we'll need.
const path = require('path');
const { fs, log, util } = require('vortex-api');


function main(context) {

    // Inform Vortex that your game extension requires the BepInEx extension.
    context.requireExtension('modtype-bepinex');

    // Registering the Liar's Bar game with all the necessary information.
    context.registerGame({
        id: GAME_ID,
        name: 'Liar\'s Bar',
        mergeMods: true,
        queryPath: findGame,
        supportedTools: [],
        queryModPath: () => '',
        logo: 'gameart.png',
        executable: () => 'Liar\'s Bar.exe',
        requiredFiles: [
            'Liar\'s Bar.exe',
        ],
        setup: prepareForModding,
        environment: {
            SteamAPPId: STEAMAPP_ID,
        },
        details: {
            steamAppId: STEAMAPP_ID,
        },
    });

    // The context.once higher-Order function ensures that we only call items
    // within this code block ONCE which makes it a perfect block to initialize
    // functionality; which is why we've added the BepInEx registration function
    // here - but theoretically you could do this during the game extension's
    // setup functor too.
    context.once(() => {
        if (context.api.ext.bepinexAddGame !== undefined) {
            context.api.ext.bepinexAddGame({
                gameId: GAME_ID,
                autoDownloadBepInEx: true,
                architecture: 'x64',
                bepinexVersion: '5.4.23.2',
                forceGithubDownload: true,
                unityBuild: 'unitymono',
            });
        }
    })

    return true;
}


function findGame() {
    return util.GameStoreHelper.findByAppId([STEAMAPP_ID])
        .then(game => game.gamePath);
}


function prepareForModding(discovery) {
    return fs.ensureDirWritableAsync(path.join(discovery.path, 'BepInEx'));
}


module.exports = {
    default: main,
};
