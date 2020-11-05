let getRGB = function(color) {
    if(!color) return {};
    let h = (color.charAt(0)==="#") ? color.substring(1,7) : color;

    return {
        "--red": parseInt(h.substring(0,2),16), 
        "--green": parseInt(h.substring(2,4),16),
        "--blue": parseInt(h.substring(4,6),16)
    }
}

export { getRGB };