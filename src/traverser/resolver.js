import {api} from '@/traverser/install';
import createAPILink from '@/traverser/normalizer';
import {get} from "@/utils/httpClient";
import router from '@/router'


export function extractView(path) {
  const matches = /\/(@[^?|/]*)/g.exec(path);
  const view = (matches && matches[1]) || '@view';
  return view.substring(1);
}

export function extractObjectPath(path) {
  return path.split(/\/(@[^?|/]*)/g)[0];
}

export function redirect(path, options) {
  return api.get(createAPILink(path, options)).catch('redirect');
}

export default function resolve(path, options) {
  // return new Promise((resolve, reject) => {
  return get(createAPILink(extractObjectPath(path), options), options.params)
  // return api.get(createAPILink(extractObjectPath(path), options), {params: options.params})
    .then(res => {return { res: res.data, view: extractView(path) }})
    .catch(error => {
      if (error.response && error.response.status === 401 ) {
        // store.dispatch('logout');
        router.push({name: "error", params: { id: error.response.status }})
        console.log("traverser resolve failed with 401")
      }
      throw error

    })

}
