<template>
    <div :id="getUniqueID()" ></div>
</template>

<script>
import $ from "jquery";

import '../../node_modules/trumbowyg/dist/ui/trumbowyg.css';
import '../../node_modules/trumbowyg/dist/plugins/emoji/ui/trumbowyg.emoji.min.css'
import '../../node_modules/trumbowyg/dist/plugins/specialchars/ui/trumbowyg.specialchars.min.css'
import 'trumbowyg/dist/plugins/table/ui/trumbowyg.table.min.css'
import 'jquery-resizable-dom'
import { v4 as uuidv4 } from 'uuid';

export default {
  props: {
    value: {
      default: null,
      validator(value) {
        return value === null || typeof value === 'string' || value instanceof String
      }
    }
  },
  emits: ['input'],
  data(){
    return {
      uniqueID: null
    }
  },
  name: 'trumbowyg',
  beforeUounted() {
    this.destroy()
  },
  mounted() {
    this.$log.debug("mounted editor", this.value)
    require('trumbowyg')
    require('trumbowyg/dist/plugins/base64/trumbowyg.base64.min.js')
    require('trumbowyg/dist/plugins/emoji/trumbowyg.emoji.min.js')
    require('trumbowyg/dist/plugins/fontfamily/trumbowyg.fontfamily.min.js')
    require('trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize.min.js')
    require('trumbowyg/dist/plugins/indent/trumbowyg.indent.min.js')
    require('trumbowyg/dist/plugins/history/trumbowyg.history.min.js')
    require('trumbowyg/dist/plugins/lineheight/trumbowyg.lineheight.min.js')
    require('trumbowyg/dist/plugins/pasteimage/trumbowyg.pasteimage.min.js')
    require('trumbowyg/dist/plugins/resizimg/trumbowyg.resizimg.min.js')
    require('trumbowyg/dist/plugins/specialchars/trumbowyg.specialchars.min.js')
    require('trumbowyg/dist/plugins/table/trumbowyg.table.min.js')

    let _self = this
    $('#' + this.getUniqueID()).trumbowyg({
      svgPath: '/static/icons.svg',
      btns: [
        ['viewHTML'],
        ['historyUndo', 'historyRedo'],
        ['formatting'],
        ['fontfamily'],
        ['fontsize'],
        ['strong', 'em', 'del'],
        ['superscript', 'subscript'],
        ['link'],
        ['insertImage'],
        ['base64'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['lineheight'],
        ['indent', 'outdent'],
        ['unorderedList', 'orderedList'],
        ['table', 'tableCellBackgroundColor', 'tableBorderColor'],
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen'],
        ['emoji'],
        ['specialChars'],
      ]
    })
      .on('tbwchange', function(){
        _self.handleInput()
      });
    $.trumbowyg.svgPath = '/static/icons.svg';
    $('#' + this.getUniqueID()).trumbowyg('html', this.value);
  },
  computet:{
  },
  methods:{
    getUniqueID(){
      if (this.uniqueID == null){
        this.uniqueID = uuidv4()
      }
      return this.uniqueID
    },
    handleInput () {
      this.$log.debug("changed text input here")
      this.$emit('input', this.getContent())
    },
    getContent(){
      return $('#' + this.getUniqueID()).trumbowyg('html')
    },
    setContent(){
      $('#' + this.getUniqueID()).trumbowyg('html', this.value);
    },
    destroy(){
      this.$log.debug("editor destroyed")
      $('#' + this.getUniqueID()).trumbowyg('destroy');
    }
  },
  watch:{
    value(newVal, oldVal){
      if (newVal === $('#' + this.getUniqueID()).trumbowyg('html')) return;
      // Set new value
      $('#' + this.getUniqueID()).trumbowyg('html', newVal)
    }

  },
  head () {
    return {
      script: [
      ]
    }
  },
}
</script>

<style lang="css" >
:root {
  --tbw-cell-vertical-padding: 4px;
  --tbw-cell-horizontal-padding: 8px;
  --tbw-cell-line-height: 1.5em;
}

table {
  margin-bottom: var(--tbw-cell-line-height);
}

th,
td {
  height: calc(var(--tbw-cell-vertical-padding) * 2 + var(--tbw-cell-line-height));
  min-width: calc(var(--tbw-cell-horizontal-padding) * 2);
  padding: var(--tbw-cell-vertical-padding) var(--tbw-cell-horizontal-padding);
  border: 1px solid #e7eaec;
}
</style>