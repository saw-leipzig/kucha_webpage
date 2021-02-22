<template>
    <caveInf v-if=cave :cave="cave"></caveInf>
</template>
<script>
import { getItemById } from '@/services/repository'
import caveInf from '@/components/caveInf'

export default {
    name: 'cave',
    components: {
            caveInf,
        },

    data () {
        return {
            error:false,
        }
    },
    computed: {
        cave(){
            console.log("computing result");
            console.log("results", this.$store.state.results);
            console.log("id",this.$route.params.id);
            var res = this.$store.state.results.find(item => item._source.caveID===parseInt(this.$route.params.id))
            console.log("res after finding in results:",res);
            if (res!=undefined){
                console.log("reutrning stored result");
                return res._source
            }
            else{
                console.log("cave in stored results not found, starting new search");
                var params={}
                params['type']="caveID"
                params['id']=this.$route.params.id
                getItemById(params)
                .then( res => {
                console.log("results",res)
                if (res.data.hits.hits.length>0){
                    this.$store.commit('setResults',res.data.hits.hits)
                }
                else{
                    this.error=true
                }
                }).catch(function (error) {
                console.log(error)
                this.error=true
                })
                return null
            }
        },
    },
    methods: {
    },
    watch: {
    },
    mounted:function () {
        console.log("setting error false");
        this.error=false;
    },
    beforeUpdate:function () {

    }
}
</script>

<style lang="css" >
</style>
