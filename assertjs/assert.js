//asertJs

//interface

type:: object -> assertType -> maybe throw exception
eg:
    var str = "";
    type(str, "string") // nothing
    type(str, "function") // throw exception
    e(str, "function", "cutome exception msg")// throw exception "custom exception msg"

notNull::

