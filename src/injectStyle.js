const injectStyle = (style) => {
    const styleElement = document.createElement('style');
    let styleSheet = null;

    styleElement.id = "inject" + style.substr(0, style.indexOf("{"))
    
    document.head.appendChild(styleElement);
    styleSheet = styleElement.sheet;
    styleSheet.insertRule(style, styleSheet.cssRules.length);
};

const deleteStyle = (style) => {
    var list = document.getElementById("inject" + style.substr(0, style.indexOf("{")));   // Get the <ul> element with id="myList"
    if (list) {
        document.head.removeChild(list);
    }
};

export {injectStyle};
export {deleteStyle};