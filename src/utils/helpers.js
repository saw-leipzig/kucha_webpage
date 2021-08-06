import 'leaflet'
import store from '../store'
import OpenSeadragon from 'openseadragon'

function getName(author) {
  return author.institutionEnabled ? author.institution : author.lastname + (author.firstname !== null && !author.firstname === "" ? ", " + author.firstname : "") + (author.alias  !==  null && !author.alias === "" ? " " + author.alias + "" : "");
}
function getAuthors(bibliography) {
  var result = "";
  if (bibliography.authorList.length > 3) {
    var author = bibliography.authorList[0];
    result = getName(author) + ", et al.";
  } else {
    for (var ae of bibliography.authorList) {
      if (result === ""){
        result += getName(ae);
      } else {
        result += "/ " + getName(ae)
      }
    }
  }
  return result;
}
function getEditors(bibliography) {
  var result = "";
  if (bibliography.editorList.length > 3) {
    var editor = bibliography.editorList[0];
    result = getName(editor) + ", et al.";
  } else {
    for (var ee of bibliography.editorList) {
      if (result === ""){
        result += getName(ee);
      } else {
        result += "/ " + getName(ee)
      }
    }
  }
  return result;
}
function getTitleORGFull(bibliography) {
  var result = bibliography.subtitleORG === "" ? bibliography.titleORG : bibliography.titleORG + ": " + bibliography.subtitleORG;
  return result;
}
function getTitleTRFull(bibliography) {
  var result = bibliography.subtitleTR === "" ? bibliography.titleTR : bibliography.titleTR + ": " + bibliography.subtitleTR;
  return result;
}

function searchTree(element, ids){
  var newChildren = []
  if (element.children !== null){
    for (var child of element.children) {
      var hasChildren = searchTree(child, ids);
      if (hasChildren !== null){
        newChildren.push(hasChildren)
      }
    }
  }
  let copy = Object.assign({}, element)
  copy.children = newChildren;
  if ((ids.includes(copy.iconographyID)) || (copy.children.length > 0)){
    copy.id = copy.iconographyID
    return copy
  } else {
    return null
  }
}
function searchTreeMinuParents(element, id){
  if ((id === element.iconographyID)){
    let copy = Object.assign({}, element)
    copy.id = copy.iconographyID
    return copy
  } else {
    if (element.children !== null){
      for (var child of element.children) {
        var ico = searchTreeMinuParents(child, id);
        if (ico !== null){
          return ico
        }
      }
    }
  } return null
}

function getTitleENFull(bibliography) {
  var result = "";
  if (bibliography.titleEN === "") {
    result = "";
  } else {
    if (bibliography.officialTitleTranslation) {
      result = bibliography.subtitleEN === "" ? "/ " + bibliography.titleEN + "" : "/ " + bibliography.titleEN + ": " + bibliography.subtitleEN + "";
    } else {
      result = bibliography.subtitleEN === "" ? "[" + bibliography.titleEN + "]" : "[" + bibliography.titleEN + ": " + bibliography.subtitleEN + "]";
    }
  }
  return result;
}
export function getWallTree(wallLocationTree, entries){
  var newChildren = []
  var result
  var newWallLocationTree = Object.assign({}, wallLocationTree)
  if (wallLocationTree.children){
    if (Array.isArray(newWallLocationTree.children)){
      for (var child of newWallLocationTree.children){
        result = getWallTree(child, entries)
        if (result !== null){
          newChildren.push(result)
        }
      }
    } else {
      result = getWallTree(newWallLocationTree.children, entries)
      if (result !== null){
        newChildren.push(child)
      }
    }
    newWallLocationTree.children = newChildren
  }
  var match = entries.find(el => el.wallLocationID === newWallLocationTree.wallLocationID)
  if ((match !== undefined) || (newWallLocationTree.children.length > 0)){
    if (match !== undefined){
      if (match.position){
        var positionName = ""
        for (var pe of match.position){
          if (positionName === ""){
            positionName = pe.name
          } else {
            positionName += ", " + pe.name
          }
        }
        if (positionName !== ""){
          newWallLocationTree.name += " (" + positionName + ")"
        }
      }
    }
    return newWallLocationTree
  } else {
    return null
  }
}
export function fillPicsContainer(relatedImages, relatedAnnotationList){
  let images = {
    annos: [],
    images: []
  }
  for (var img of relatedImages){
    if (relatedAnnotationList.find(element => parseInt(element.image.split(".")[0]) === img.imageID)) {
      images.annos.push(img)
    } else {
      images.images.push(img)
    }
  }
  return images
}
export function getIconographyByAnnos(ids){
  var returnElement = []
  for (var rootElement of store.state.dic.iconography){
    var dummy = Object.assign({}, rootElement)
    var result = searchTree(dummy, ids)
    if (result !== null){
      returnElement.push(result)
    }
  }
  return returnElement
}
export function getIconographyByID(id){
  var returnElement = {}
  for (var rootElement of store.state.dic.iconography){
    var dummy = Object.assign({}, rootElement)
    var result = searchTreeMinuParents(dummy, id)
    if (result !== null){
      returnElement = result
      break
    }
  }
  return returnElement
}

export function checkImgPermitted(item){
  console.log("checkImgPermitted input", item);
  let isPermit = false
  if (item){
    if (item.filename){
      if (item.accessLevel > 1){
        isPermit = true
      } else {
        isPermit = false
      }
    } else {
      isPermit = false
    }
  } else {
    isPermit = false
  }
  return isPermit
}

export function getWallTreeByIDs(wallIDs, wallLocation){
  var wallClone = Object.assign({}, wallLocation)
  var walls = []
  for (var key in wallClone){
    var res = getWallTree(wallClone[key], wallIDs)
    if (res !== null){
      walls.push(res)
    }
  }
  return walls
}
export function getWallLabels(wallLocation, depiction, label){
  var results = ""
  if (depiction){
    var wallTrees = getWallTreeByIDs(depiction.wallIDs, wallLocation)
    for (var wallTree of wallTrees){
      var result = getWallTreeLabels(wallTree, label)
      if (results === ""){
        results += result
      } else {
        results += "/ " + result
      }
    }
    if (depiction.positionNotes && depiction.positionNotes !== null){
      if (results !== ""){
        results += ", " + depiction.positionNotes
      } else {
        results += depiction.positionNotes
      }
    }
  }
  return results
}
export function getWallTreeLabels(wallTree, label){
  var results = []
  if (label === ""){
    label += wallTree.name
  } else {
    label += ", " + wallTree.name
  }
  if (wallTree.children ){
    if (wallTree.children.length > 0){
      for (var child of wallTree.children){
        var res = getWallTreeLabels(child, label)
        results.push(res)
      }
    } else {
      results.push(label)
    }
  } else {
    results.push(label)
  }
  return results
}
export function getBibTitle(bibliography){
  if (bibliography.publicationType){
    var bib = "";
    var translit = "";
    var bold = "";
    var translat = "";
    var tail = "";
    if ((bibliography.publicationType.publicationTypeID === 1) || (bibliography.publicationType.publicationTypeID === 3)) {
      if (getAuthors(bibliography) === "") {
        if (getEditors(bibliography) !== "") {
          bib = bib + getEditors(bibliography) + " (ed.)";
        }
      } else {
        bib = bib + getAuthors(bibliography);
      }
      if (bibliography.yearORG !== "") {
        bib = bib + ", " + bibliography.yearORG + ",";
      }
      if (getTitleTRFull(bibliography) !== "") {
        translit = " " + getTitleTRFull(bibliography);
      }
      if (getTitleORGFull(bibliography) !== "") {
        bold = " " + getTitleORGFull(bibliography);
      }
      if (getTitleENFull(bibliography) !== "") {
        translat = " " + getTitleENFull(bibliography);
      }
      if (bibliography.volumeORG !== "") {
        tail = tail + ", Vol." + bibliography.volumeORG;
      }
      if (bibliography.editionORG !== "") {
        tail = tail + ", Edition: " + bibliography.editionORG;
      }
      if (bibliography.seriesORG !== "") {
        tail = tail + ", Series: " + bibliography.seriesORG;
      }
      tail = tail + ". ";
      if (bibliography.publisher !== "") {
        tail = tail + bibliography.publisher;
      }
      if (bibliography.thesisType !== "") {
        if (bibliography.publisher === "") {
          tail = tail + bibliography.thesisType + " thesis";
        } else {
          tail = tail + ", " + bibliography.thesisType;
        }
      }
      if (bibliography.quotedPages !== "" && bibliography.quotedPages !== undefined) {
        tail = tail + ", " + bibliography.quotedPages;
      }
      tail = tail + ". ";
      if (bibliography.hesHan){
        return bib + "<i>" + translit + "</i><b>" + bold + "</b> " + translat + tail

      } else {
        return bib + "<i>" + translit + "<b>" + bold + "</b></i> " + translat + tail
      }
    } else if ((bibliography.publicationType.publicationTypeID === 4) || (bibliography.publicationType.publicationTypeID === 7)) {
      bib = bib + getAuthors(bibliography);
      if (bibliography.yearORG !== "") {
        bib = bib + ", " + bibliography.yearORG + ",";
      }
      if (getTitleTRFull(bibliography) !== "") {
        bib = bib + " " + getTitleTRFull(bibliography);
      }
      if (getTitleORGFull(bibliography) !== "") {
        bib = bib + " " + getTitleORGFull(bibliography);
      }
      if (getTitleENFull(bibliography) !== "") {
        bib = bib + " " + getTitleENFull(bibliography);
      }
      bib = bib + ". In: ";
      if (getEditors(bibliography)  !== "") {
        bib = bib + getEditors(bibliography);
        if (bibliography.editorType === "") {
          bib = bib + " (" + bibliography.editorType + ")";
        }
      }
      if (bibliography.parentTitleTR !== "") {
        translit = translit + " " + getTitleTRFull(bibliography);
      }
      if (bibliography.parentTitleORG !== "") {
        bold = bold + " " + bibliography.parentTitleORG;
      }
      if (bibliography.parentTitleEN !== "") {
        translat = translat + " [" + bibliography.parentTitleEN + "]";
      }
      tail = tail + ". ";
      if (bibliography.publisher !== "") {
        tail = tail + bibliography.publisher;
      }
      if (bibliography.pagesORG !== "") {
        if (bibliography.publisher === "") {
          tail = tail + ". " + bibliography.pagesORG;
        } else {
          tail = tail + ", " + bibliography.pagesORG;
        }
      }
      if (bibliography.url !== "") {
        tail = tail + ", " + bibliography.url;
        if (bibliography.accessdateORG !== "") {
          tail = tail + " [" + bibliography.accessdateORG + "]";
        }
      }
      if (bibliography.quotedPages !== "" && bibliography.quotedPages !== undefined) {
        tail = tail + ", " + bibliography.quotedPages;
      }
      tail = tail + ". ";
      if (bibliography.hesHan){
        return bib + "<i>" + translit + "</i><b>" + bold + "</b> " + translat + tail
      } else {
        return bib + "<i>" + translit + "<b>" + bold + "</b></i> " + translat + tail
      }
    } else if (bibliography.publicationType.publicationTypeID === 8) {
      bib = bib + getAuthors(bibliography);
      if (bibliography.yearORG !== "") {
        bib = bib + ", " + bibliography.yearORG + ",";
      }
      if (getTitleTRFull(bibliography) !== "") {
        translit = " " + getTitleTRFull(bibliography);
      }
      if (getTitleORGFull(bibliography) !== "") {
        bold = " " + getTitleORGFull(bibliography);
      }
      if (getTitleENFull(bibliography) !== "") {
        translat = " " + getTitleENFull(bibliography);
      }
      if (bibliography.parentTitleORG !== "") {
        tail = tail + ", " + bibliography.parentTitleORG;
      }
      if (bibliography.volumeORG !== "") {
        tail = tail + " " + bibliography.volumeORG;
      }
      if (bibliography.issueORG !== "") {
        tail = tail + " " + bibliography.issueORG;
      }
      if (bibliography.pagesORG !== "" ) {
        if (bibliography.publisher === "") {
          tail = tail + ". " + bibliography.pagesORG;
        } else {
          tail = tail + ", " + bibliography.pagesORG;
        }
      }
      if (bibliography.quotedPages !== "" && bibliography.quotedPages !== undefined) {
        tail = tail + ", " + bibliography.quotedPages;
      }
      tail = tail + ". ";
      if (bibliography.hesHan){
        return bib + "<i>" + translit + "</i><b>" + bold + "</b> " + translat + tail
      } else {
        return bib + "<i>" + translit + "<b>" + bold + "</b></i> " + translat + tail
      }
    } else {
      return ("undefined")
    }
  } else {
    return ("undefined")
  }
}
export function getOSDURLs(images){
  let tiles = []
  for (let ie of images) {
    tiles.push(process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + ie.filename + "/info.json")
  }
  return tiles
}

export function setOSDImgOverlayImg(image, viewer){
  var elm = document.createElement("dl");
  elm.id = "html-overlay"
  var titleHd = document.createElement("dt");
  titleHd.innerHTML = "Filename:"
  var title = document.createElement("dd");
  title.innerHTML = image.filename
  var copyrightHd = document.createElement("dt");
  copyrightHd.innerHTML = "Copyright:"
  var copyright = document.createElement("dd");
  copyright.innerHTML = image.copyright
  elm.appendChild(titleHd)
  elm.appendChild(title)
  elm.appendChild(copyrightHd)
  elm.appendChild(copyright)
  if (viewer.getOverlayById("html-overlay") === null) {
    viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, 1.2, 1), true);
    var textPoint = new OpenSeadragon.Point(1.01, 0);
    viewer.addOverlay(elm, textPoint)
  } else {
    viewer.clearOverlays()
  }
}

export function getOSDURL(image){
  let tiles = []
  tiles.push(process.env.VUE_APP_IIIFAPI + "/iiif/2/kucha%2Fimages%2F" + image.filename + "/info.json")
  return tiles
}

export function getSiteLabel(item, sites){
  let site = item > 0 ? store.getters.getDics.sites.find(site => site.siteID === item).name : "";
  return site
}
export function getRegionLabel(item, regions){
  let region = item > 0 ? store.getters.getDics.region.find(region => region.regionID === item).englishName : "";
  return region
}
export function getDistrictLabel(item){
  let rdistrict = item > 0 ? store.getters.getDics.districts.find(district => district.districtID === item).name : "";
  return rdistrict
}
export function findAgg(aggs, key){
  for (let agg of aggs){
    if (agg.key === key){
      return agg.doc_count
    }
  }
  return "0"
}
export function buildAgg(aggInfo, reference, aggsObject){
  if (Array.isArray(reference)){
    for (let ref of reference){
      delete aggsObject[ref]
    }
  } else {
    delete aggsObject[reference]
  }

  for (let prop in aggInfo){
    aggsObject[prop] = {}
    if (aggInfo[prop].ids){
      aggsObject[prop]['filter'] = {
      }
      aggsObject[prop].filter[prop] = {
        "filter": {
          "terms" : {
          }
        }
      }
      aggsObject[prop].filter[prop].filter.terms[aggInfo[prop].field] = aggInfo[prop].ids
    }
    aggsObject[prop]['agg'] = {
    }
    aggsObject[prop].agg[prop] = {
      "terms" : {
        "size": 10000
      }
    }
    aggsObject[prop].agg[prop].terms["field"] = aggInfo[prop].field
  }
}

export function getBuckets(element){
  for (let prop in element){
    if (prop === "buckets"){
      return element[prop]
    } else {
      let res = getBuckets(element[prop])
      if (res !== null){
        return res
      }
    }
  }
  return null
}

export function getDepictionLabel(depiction, wallLocation){
  let depictionLabel =  "Information for Painted Representation ID " + depiction.depictionID
  if (depiction.shortName){
    depictionLabel += " (" + depiction.shortName + ")"
  }
  if (depiction.cave) depictionLabel += ", " + getCaveShortLabel(depiction.cave);
  depictionLabel += ", " + getWallLabels(wallLocation, depiction, "")
  return depictionLabel
}
export function getCaveLabel(item){
  let site = item.siteID > 0 ? store.getters.getDics.sites.find(site => site.siteID === item.siteID).shortName : "";
  let district = item.districtID > 0 ? store.getters.getDics.districts.find(district => district.districtID === item.districtID).name : "";
  let region = item.regionID > 0 ? store.getters.getDics.region.find(region => region.regionID === item.regionID).englishName : "";
  let caveLabel = site + " " + item.officialNumber + (!(district.length === 0) ? " / " + district : "") + (!(region.length === 0) ? " / " + region : "");
  return caveLabel

}
export function getCaveShortLabel(item){
  return item.site.shortName + " " + item.officialNumber
}