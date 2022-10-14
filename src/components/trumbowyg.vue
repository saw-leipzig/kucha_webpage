<template>
    <div :id="getUniqueID()" v-on:input="handleInput()"></div>
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
    'modelValue': String
  },
  emits: ['update'],
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
    this.$log.debug("mounted editor", this.modelValue)
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
        ['table'],
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
    $('#' + this.getUniqueID()).trumbowyg('html', this.modelValue);
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
      this.$log.debug("changed text input")
      this.$emit('update', this.modelValue)
    },
    getContent(){
      return $('#' + this.getUniqueID()).trumbowyg('html')
    },
    setContent(){
      $('#' + this.getUniqueID()).trumbowyg('html', this.modelValue);
    },
    destroy(){
      this.$log.debug("editor destroyed")
      $('#' + this.getUniqueID()).trumbowyg('destroy');
    }
  },
  watch:{
    value(newVal, oldVal){
      this.setContent()
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