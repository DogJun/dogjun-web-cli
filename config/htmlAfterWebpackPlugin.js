const pluginName = 'htmlAfterWebpackPlugin';
const assetsHelp = (data)=>{
    // let css = [],js = [];
    let css = '',js = ''; 
    const dir = {
        js: item => `<script src="${item}"></script>`,
        css: item => `<link rel="stylesheet" href="${item}">`
    };
    for (let jsitem of data.js){
        // js += dir.js(jsitem)
        js += dir.js(jsitem)
    }
    for(let cssitem of data.css){
        // css.push(dir.css(cssitem))
        css += dir.css(cssitem)
    }
    return{
        css,
        js
    }
}
class htmlAfterWebpackPlugin {
    apply(compiler) {
        //html-webpack-plugin-before-html-processing
        compiler.hooks.compilation.tap(pluginName, compilation => {
            compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(pluginName,htmlPluginData=>{
                let _html = htmlPluginData.html;
                const result = assetsHelp(htmlPluginData.assets);
                console.log('css', result.css)
                console.log('js', result.js)
                console.log('_html', _html)
                _html = _html.replace("<!--injectcss-->",result.css);
                _html = _html.replace("<!--injectjs-->",result.js);
                console.log('得到的值',_html);
                htmlPluginData.html = _html;
            })
        });
    }
}
module.exports = htmlAfterWebpackPlugin;