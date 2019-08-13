// From https://gist.github.com/gauravtiwari/2ae9f44aee281c759fe5a66d5c2721a2
// By https://gist.github.com/gauravtiwari
// Also from this articles; https://medium.com/front-end-weekly/use-github-oauth-as-your-sso-seam

import {IUser} from './App';

function opeNewAuthWindow(myUrl: string): Promise<IUser> {
  // Open the new window, if window can't open, return null
  const authWindow: Window = window.open(myUrl, '_blank') as Window;
  
  // Listen for message from authWindow
  const authPromise: Promise<IUser> = new Promise((resolve, reject) => {
    window.addEventListener('message', (msg) => {
      // check msg origin
      // if not from our own window, reject
      if (!msg.origin.includes(`${window.location.protocol}//${window.location.host}`)) {
        authWindow.close();
        reject("Not allowed")
      }

      if (msg.data.payload) {
        try {
          resolve(JSON.parse(msg.data.payload))
        }
        catch(err) {
          resolve(msg.data.payload)
        }
        finally {
          authWindow.close()
        }
      } else {
        authWindow.close()
        reject('Unauthorized')
      }
    }, false);
  })
  
  return authPromise;
}

export default opeNewAuthWindow;