import Vue from 'vue'
import 'leaflet'
import edtf from 'edtf'
import { portalTypesSources, portalTypesPub, regions ,sites, districts} from '@/utils/constants'

const dateType = new edtf.Date().type
const intervalType = new edtf.Interval().type
const seasonType = new edtf.Season().type
const localDateStringSupport = toLocaleDateStringSupportsLocales()
const options = {
  3: {
    //weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  },
  2: {
    year: 'numeric',
    month: 'numeric',
  },
  1: {
    year: 'numeric',
  }
}


function toLocaleDateStringSupportsLocales() {
  try {
    new Date().toLocaleDateString('i');
  } catch (e) {
    return e.name === 'RangeError';
  }
  return false;
}

/**
 * Transform a given EDTF Object into a localized date string
 * @param  {Object} edtf_date A simple object with type, level and values
 * @param  {String} locale    Language, e.g. 'en' or 'de'
 * @return {String}           Localized date string, if toLocaleDateString supports locale and options parameter, edtf string otherwise.
 */
function getLocalDateString (edtf_date, locale) {
  if (localDateStringSupport) {
    let lds = new Date(edtf_date.min).toLocaleDateString(locale, options[edtf_date.values.length])
    return lds
  }
  else {
    return edtf_date.edtf
  }
}
export function getSiteLabel(item){
  let site = item > 0 ? sites.find(site => site.siteID===item).name : "";
  console.log("Site:",sites);
  return site
}
export function getRegionLabel(item){
  let region = item > 0 ? regions.find(region => region.regionID===item).englishName: "";
  return region
}
export function getDistrictLabel(item){
  let rdistrict = item > 0 ? districts.find(district => district.districtID===item).name: "";
  return rdistrict
}

export function getCaveLabel(item){
  let site = item.siteID > 0 ? sites.find(site => site.siteID===item.siteID).shortName : "";
  let district = item.districtID > 0 ? districts.find(district => district.districtID===item.districtID).name
      : "";
  let region = item.regionID > 0 ? regions.find(region => region.regionID===item.regionID).englishName
      : "";
  let caveLabel = site + " " + item.officialNumber + (!(district.length == 0) ? " / " + district : "")
      + (!(region.length == 0) ? " / " + region : "");
  return caveLabel

}
export function extractLatLng(items, icon, tooltipextension='') {
  //workaround to get rid of the 'L' is not defined error from leaflet
  var L = window.L;
  icon = icon || L.Icon.default
  let markers = [];
  items.forEach( item => {
    if(item) {
      try {
       var myLatLng = L.latLng(item.latitude, item.longitude);
       if(myLatLng != null) {
        //let key = item.latitude+"_"+item.longitude+"_"+index;
        markers.push( {'tooltip': item.title, 'url': item['@id'], 'edtf': item.EdtfDate, LatLng: myLatLng, icon: icon, tooltipExtension: tooltipextension });
        }
      }
      catch (e){
        Vue.$log.error("Wrong latitude or longitude set: ", item? item.title : null)
      }
    }
  })
  return markers;
}

function UnparsableEtdfLibraryException(message) {
  this.message = message
}

function UnparsableEtdfException(message) {
   this.message = message
}

function parseEdtf(edtf_date_field) {
  let edtf_date = null
  try {
    edtf_date = edtf(edtf_date_field, { level: 3 })
  }
  catch(e) {
    throw new UnparsableEtdfLibraryException('Unparsable Etdf - Library exception')
  }

  if (!edtf_date ) {
   throw new UnparsableEtdfException('Unparsable Etdf')
  }

  if (edtf_date.type == undefined ) {
    throw new UnparsableEtdfException('Unparsable Etdf')
  }
  else if (edtf_date.type == intervalType) {
    let unparsable = edtf_date.values.find(d => { return d.type == undefined })
    if (unparsable != undefined) {
       throw new UnparsableEtdfException('Unparsable Etdf')
    }
  }
  return edtf_date
}

function ownConversionOfEdtf(edtf_date_field, parseable) {

  if(! parseable) {

    return edtf_date_field
  }
  let edtf_date_parsed_object = edtf.parse(edtf_date_field, { level: 3 })

   return getViewableDateFromParsedObject(edtf_date_parsed_object)

}

export function getViewableEdtfDate (edtf_date_field) {
      // dates in facts are edtf_date-fields so we use edtf.js
      // https://github.com/inukshuk/edtf.js#readme
      let edtf_date = null
      try {
        edtf_date = parseEdtf(edtf_date_field)
      }
      catch(e) {
        if (e instanceof UnparsableEtdfLibraryException) {
          Vue.$log.error('UnparsableEtdfLibraryException', edtf_date_field)
          return ownConversionOfEdtf(edtf_date_field, false)
        } else {
          return ownConversionOfEdtf(edtf_date_field, true)
        }
      }

      return getViewableDateFromFullObject (edtf_date)
}

function getViewableDateFromFullObject (edtf_date_full_object) {

      let prefix =''
      let local_datestring = 'unparsed EDTF'

       if (edtf_date_full_object.approximate && edtf_date_full_object.approximate.value) {
          prefix = VueI18n.t('circa') + ' '
        }

      if (edtf_date_full_object.type == dateType) {
        local_datestring = getLocalDateString(edtf_date_full_object, VueI18n.locale)
      }

      else if (edtf_date_full_object.type == seasonType) {
        local_datestring = season_map[edtf_date_full_object.values[1]] + ' ' + edtf_date_full_object.values[0]
      }

      else if (edtf_date_full_object.type == intervalType) {
        // Warning: the max value is a not included border value
        // Warning: is it possible that there are more than two values?
        let interval = edtf_date_full_object.values.map(d => {
          return getViewableDateFromFullObject (d)
        })
        local_datestring = interval.join(' - ')
      }
      return prefix + local_datestring
}

function getViewableDateFromParsedObject (edtf_date_parsed_object) {

      let prefix =''
      let local_datestring = 'unparsed pEDTF'

      if (edtf_date_parsed_object.approximate) {
          prefix = VueI18n.t('circa') + ' '
      }

      if (edtf_date_parsed_object.type == 'Date') {
       // Vue.$log.debug('type is date', edtf_date_parsed_object)
        if(edtf_date_parsed_object.values && edtf_date_parsed_object.values.length > 1) {
          let date = new Date(...edtf_date_parsed_object.values)
          Vue.$log.debug('date', date)
          local_datestring = date.toLocaleDateString(VueI18n.locale,  options[edtf_date_parsed_object.values.length])
        }
        else {
          local_datestring = edtf_date_parsed_object.values[0]
        }
      }

      else if (edtf_date_parsed_object.type == 'Season') {
        //Vue.$log.debug('type is season', edtf_date_parsed_object)
        local_datestring = season_map[edtf_date_parsed_object.values[1]] + ' ' + edtf_date_parsed_object.values[0]
      }

      else if (edtf_date_parsed_object.type == 'Interval') {
        //Vue.$log.debug('type is interval', edtf_date_parsed_object)
        // Warning: the max value is a not included border value
        // Warning: is it possible that there are more than two values?
        let interval = edtf_date_parsed_object.values.map(d => {
          return getViewableDateFromParsedObject (d)
        })
        local_datestring = interval.join(' - ')
      }
      return prefix + local_datestring
}

export function getMarkerIcon(type) {
  var L = window.L;
  switch (type) {
    case 'person_birthplace': return greenMarkerIcon
    case 'person_placeofdeath': return redMarkerIcon
    case 'person_gravesite':return blackMarkerIcon
    case 'location_subitem': return violetMarkerIcon
    case 'person_placeofactivity': return orangeMarkerIcon
    default:
      return new L.Icon.Default()
  }

}

/*export const blueMarkerIcon = new L.Icon({
  iconUrl: require('@/img/marker-icon-2x-blue.png'),
  shadowUrl: require('@/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});*/
//eslint-disable-next-line
export const redMarkerIcon = new L.Icon({
  iconUrl: require('@/img/marker-icon-2x-red.png'),
  shadowUrl: require('@/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  type: 'person_placeofdeath'
});
//eslint-disable-next-line
export const greenMarkerIcon = new L.Icon({
  iconUrl: require('@/img/marker-icon-2x-green.png'),
  shadowUrl: require('@/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  type: 'person_birthplace'
});
//eslint-disable-next-line
export const blackMarkerIcon = new L.Icon({
  iconUrl: require('@/img/marker-icon-2x-black.png'),
  shadowUrl: require('@/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  type: 'person_gravesite'
});

//eslint-disable-next-line
export const orangeMarkerIcon = new L.Icon({
  iconUrl: require('@/img/marker-icon-2x-orange.png'),
  shadowUrl: require('@/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  type: 'person_placeofactivity'
});

//eslint-disable-next-line
export const violetMarkerIcon = new L.Icon({
  iconUrl: require('@/img/marker-icon-2x-violet.png'),
  shadowUrl: require('@/img/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  type: 'person_placeofactivity'
});

export function getSourceTypeLegend() {
  let legendObject = {}
  legendObject.title = VueI18n.t('sopu-types-of-sources')
  legendObject.items = portalTypesSources.map( pt => { return { svg: pt, description: VueI18n.t('portal-type.' + pt), itemClasses: "" }})
  return legendObject

}

export function getPublicationTypeLegend() {
  let legendObject = {}
  legendObject.title = VueI18n.t('sopu-types-of-publications')
  legendObject.items = portalTypesPub.map( pt => {return { svg: pt, description: VueI18n.t('portal-type.' + pt) }})
  return legendObject
}

export function getMapMarkerLegend() {
  let marker = [ 'person_birthplace', 'person_placeofdeath','person_gravesite','person_placeofactivity', 'location_default', 'location_subitem']
  let legendObject = {}
  legendObject.title = VueI18n.t('legend.map-legend-headline')
  legendObject.items = [];
  marker.forEach(function(mi) {
    let icon = getMarkerIcon(mi)
    if(icon && icon.options)
    legendObject.items.push(  { img: icon.options.iconUrl, description: VueI18n.t(mi) })

  })
  return legendObject
}

export function getDigitalCopyLegend() {
  let legendObject = {}
  legendObject.title = VueI18n.t('legend.dc-headline')
  legendObject.description = VueI18n.t('legend.dc-description')
  legendObject.items = [];
  legendObject.items.push( { svg: 'dc_local', description: VueI18n.t('legend.dc-local') })
  legendObject.items.push( { svg: 'dc_external', description: VueI18n.t('legend.dc-external') })
  return legendObject
}

export function getLinkLegend() {
  let legendObject = {}
  legendObject.title = VueI18n.t('legend.link-legend-headline')
  legendObject.items = [];
  legendObject.items.push( { icon: 'mdi-link-variant', description: VueI18n.t('legend.link-legend-internal') })
  legendObject.items.push( { icon: 'mdi-open-in-new', description: VueI18n.t('legend.link-legend-external') })
  return legendObject
}

export function getMembership() {
  let legendObject = {}
  legendObject.title = VueI18n.t('legend.membership-headline')
  legendObject.items = [];
  legendObject.items.push( { icon: 'mdi-account', description: VueI18n.t('legend.membership-true'), itemProps: { color: 'green'}, itemClasses: "primary--text" })
  legendObject.items.push( { icon: 'mdi-account', description: VueI18n.t('legend.membership-false') })
  return legendObject
}



