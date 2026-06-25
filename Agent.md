PS E:\My Projects\Ecommerece App\frontend> npx expo run
√ Select the platform to run » Android
› Using expo run:android 
env: load .env
env: export EXPO_PUBLIC_API_URL
⚠️  Requested prebuild for "android", but only "web" is present in app confi
g ("expo.platforms" entry). Continuing with "android".
√ Created native directory
√ Updated package.json
× Prebuild failed
Error: [android.dangerous]: withAndroidDangerousBaseMod: Crc error - 3834780
PS E:\My Projects\Ecommerece App\frontend> npx tsc --noEmit  
components/home/HeroBanner.tsx:23:23 - error TS2554: Expected 1 arguments, but got 0.

23   const intervalRef = useRef<ReturnType<typeof setInterval>>()
                         ~~~~~~

  node_modules/@types/react/index.d.ts:1726:24
    1726     function useRef<T>(initialValue: T): RefObject<T>;
    An argument for 'initialValue' was not provided.

hooks/useSearch.ts:6:23 - error TS2554: Expected 1 arguments, but got 0.    

6   const debounceRef = useRef<ReturnType<typeof setTimeout>>()
                        ~~~~~~

  node_modules/@types/react/index.d.ts:1726:24
    1726     function useRef<T>(initialValue: T): RefObject<T>;
                                ~~~~~~~~~~~~~~~
    An argument for 'initialValue' was not provided.


Found 2 errors in 2 files.

Errors  Files
     1  components/home/HeroBanner.tsx:23
     1  hooks/useSearch.ts:6
PS E:\My Projects\Ecommerece App\frontend> npx expo start -c  
env: load .env
env: export EXPO_PUBLIC_API_URL
Starting project at E:\My Projects\Ecommerece App\frontend
Starting Metro Bundler
warning: Bundler cache is empty, rebuilding (this may take a minute)
The following packages should be updated for best compatibility with the installed expo version:
  react@19.1.8 - expected version: 19.1.0
  react-dom@19.1.8 - expected version: 19.1.0
  react-native@0.81.6 - expected version: 0.81.5
  @types/react@19.0.14 - expected version: ~19.1.10
  typescript@5.6.3 - expected version: ~5.9.2
Your project may not work correctly until you install the expected versions 
of the packages.
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █   █▄ ▀▄▀█ ▄▄▄▄▄ █
█ █   █ █ ▀▄ █▀▄ ▄█ █   █ █
█ █▄▄▄█ █▀██▀▀█▀▄██ █▄▄▄█ █
█▄▄▄▄▄▄▄█▄▀▄█ █▄█▄█▄▄▄▄▄▄▄█
█▄▄▀█▄ ▄█▀▀▀▄▀█▄ ███ ▀▄▄ ▄█
█▄ ▀▀██▄ ▀█▀ ▄██ ▀▀ █▄  ▀██
█ ▀▀▄ █▄▄▀▀▄█▄▀▄▀▄▀▄▀▀▄ ▀██
███▀▄▀▄▄▄█ ██▀██▄▄▄█▄▀ ▀███
█▄▄█▄▄█▄█ ▀▄▄▀█▄▄ ▄▄▄ ▀ ▄▄█
█ ▄▄▄▄▄ █▀█▄ ▄██▀ █▄█ ▀▀█▀█
█ █   █ █▄▄ █▄▀▄█▄▄ ▄▄▀   █
█ █▄▄▄█ █▀▄██▀█▀▄██▄▀█▀▀ ██
█▄▄▄▄▄▄▄█▄█▄▄▄▄▄████▄▄▄▄▄▄█

› Metro waiting on exp://192.168.1.11:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)     

› Web is waiting on http://localhost:8081

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
Android Bundling failed 1344ms node_modules\expo-router\entry.js (1 module) 
 ERROR  Error: [BABEL]: Cannot find module 'react-native-worklets/plugin'   
Require stack:
- E:\My Projects\Ecommerece App\frontend\node_modules\react-native-reanimated\plugin\index.js
- E:\My Projects\Ecommerece App\frontend\node_modules\@babel\core\lib\config\files\module-types.js
- E:\My Projects\Ecommerece App\frontend\node_modules\@babel\core\lib\config\files\configuration.js
- E:\My Projects\Ecommerece App\frontend\node_modules\@babel\core\lib\config\files\index.js
- E:\My Projects\Ecommerece App\frontend\node_modules\@babel\core\lib\index.js
- E:\My Projects\Ecommerece App\frontend\node_modules\expo\node_modules\@expo\metro-config\build\transform-worker\metro-transform-worker.js
- E:\My Projects\Ecommerece App\frontend\node_modules\expo\node_modules\@expo\metro-config\build\transform-worker\transform-worker.js
- E:\My Projects\Ecommerece App\frontend\node_modules\@expo\metro\node_modules\metro\src\DeltaBundler\Worker.flow.js
- E:\My Projects\Ecommerece App\frontend\node_modules\@expo\metro\node_modules\metro\src\DeltaBundler\Worker.js
- E:\My Projects\Ecommerece App\frontend\node_modules\jest-worker\build\workers\processChild.js (While processing: E:\My Projects\Ecommerece App\frontend\node_modules\react-native-reanimated\plugin\index.js)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1476:15)   
    at wrapResolveFilename (node:internal/modules/cjs/loader:1049:27)       
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1073:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1094:12)    
    at Module._load (node:internal/modules/cjs/loader:1262:25)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.require (node:internal/modules/cjs/loader:1576:12)
    at require (node:internal/modules/helpers:153:16)
    at Object.<anonymous> (E:\My Projects\Ecommerece App\frontend\node_modules\react-native-reanimated\plugin\index.js:2:16)
    at Module._compile (node:internal/modules/cjs/loader:1830:14)
    at Object..js (node:internal/modules/cjs/loader:1961:10)
    at Module.load (node:internal/modules/cjs/loader:1553:32)
    at Module._load (node:internal/modules/cjs/loader:1355:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)
    at Module.require (node:internal/modules/cjs/loader:1576:12)
