import { redirect, extractObjectPath } from '@/traverser/resolver';
import joinPath from 'path.join';


export default function executeHook(hook, from, to, options) {
  if (!hook) {
    return Promise.reject(new Error("something bad happened"));
  }

  return new Promise((resolve, reject) => {
    hook(
      from,
      to,
      (path) => {
        if (typeof path === 'undefined') {
          reject(new Error("something bad happened"));
        }
        redirect(joinPath(extractObjectPath(to), path), options)
          .then(({ data }) => {
            resolve({ data, key: path });
          })
          .catch(reject);
      },
    );
  });
}
