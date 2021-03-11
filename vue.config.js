module.exports = {

  //lintOnSave: false,
  chainWebpack: config => {
    //config.module.rules.delete('eslint');
  },
  lintOnSave: false,
    configureWebpack: {        
    devServer: {
        headers: {
          'Access-Control-Allow-Origin': '*'            
        }
      }
    }
    
  }