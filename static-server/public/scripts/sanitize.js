"use strict";
function Sanitize() {
    var e, i;
    for (i = arguments[0] || {},
             this.config = {},
             this.config.elements = i.elements ? i.elements : [],
             this.config.attributes = i.attributes ? i.attributes : {},
             this.config.attributes[Sanitize.ALL] = this.config.attributes[Sanitize.ALL] ? this.config.attributes[Sanitize.ALL] : [],
             this.config.allow_comments = i.allow_comments ? i.allow_comments : false,
             this.allowed_elements = {},
             this.config.protocols = i.protocols ? i.protocols : {},
             this.config.add_attributes = i.add_attributes ? i.add_attributes : {},
             this.dom = i.dom ? i.dom : document,
             e = 0;
             this.config.elements.length > e; e++)
    this.allowed_elements[this.config.elements[e]] = true;
    if (this.config.remove_element_contents = {}, this.config.remove_all_contents = false, i.remove_contents)
        if (i.remove_contents instanceof Array)
            for (e = 0; i.remove_contents.length > e; e++) this.config.remove_element_contents[i.remove_contents[e]] = true;
        else this.config.remove_all_contents = true;
    this.transformers = i.transformers ? i.transformers : []
}
;