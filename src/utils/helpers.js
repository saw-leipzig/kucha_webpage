import 'leaflet'
import store from '../store'

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
  var wallTrees = getWallTreeByIDs(depiction.wallIDs, wallLocation)
  var results = ""
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
    if (bibliography.pagesORG !== "") {
      if (bibliography.publisher === "") {
        tail = tail + ". " + bibliography.pagesORG;
      } else {
        tail = tail + ", " + bibliography.pagesORG;
      }
    }
    if (bibliography.hesHan){
      return bib + "<i>" + translit + "</i><b>" + bold + "</b> " + translat + tail
    } else {
      return bib + "<i>" + translit + "<b>" + bold + "</b></i> " + translat + tail
    }
  } else {
    return ("undefined")
  }
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
  let depictionLabel =  "Information for Painted Representation " + depiction.depictionID
  if (depiction.cave) depictionLabel += ", " + getCaveShortLabel(depiction.cave);
  else if (depiction.shortName){
    if (depiction.shortName !== ""){
      depictionLabel += ", " + depiction.shortName
    }
  }
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