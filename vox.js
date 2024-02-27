// Vox = Voice in Latin

let vox = {}

vox.dex = null              // this is the dictionary
vox.pluralisation = null    // this is a function for the plural form
vox.debug = false


// Please add wanted language to .mapPlurals
// And also document yourself and create the plural function.
// https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html
vox.mapPlurals = [
  {
    langs: ["jp", "vi", "ko", "th"],
    plural: () => 0
  },
  {
    langs: ["en", "de", "nl", "sv", "da", "no", "es", "pt", "it", "gr", "bg", "fi", "et", "eo", "hu", "tk"],
    plural: (n) => (n != 1 ? 1 : 0)
  },
  {
    langs: ["br", "fr"],
    plural: (n) => (n > 1 ? 1 : 0)
  }
]

vox.initPluralisation = function () {
  let OK = false
  for (let group of vox.mapPlurals) {
    for (let lang of group.langs) {
      if (navigator.language.includes(lang)) {
        OK = true
        vox.pluralisation = group.plural
        vox.lang = lang
      }
    }
    if (OK) break
  }
}

vox.fetchDict = async function (URL) {
  // https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html
  let res = await fetch(URL)
    .then((res) => res.json())
    .catch(() => {
      console.error("Could not fetch the translation from", URL)
      return null // if error vox.dex is null
    })
  return res
}

vox._t = function () {
  /**
   * This function translates single text/paragraphs/words
   * usage:
   * _t('grandpa drinks beer')  = "おじいちゃんはビールを飲みます"
   */
  let a1 = arguments[0]
  if (vox.dex === null || vox.dex === undefined) {
    return a1
  }
  let trans = ""
  if (a1 in vox.dex.singular) {
    trans = vox.dex.singular[a1]
  } else {
    trans = a1
  }
  vox.debug && console.log("_t--trans:", trans)
  return trans
}

vox._tc = function () {
  /**
   * This function add a context to the text/word/s.
   * First argument is context, second is the text/word/s
   * usage:
   * _tc("pc-file","file")
   * _tc("paper","file")
   */
  let ct = arguments[0] // context
  let p1 = arguments[1] // translation text
  let trans = ""
  if (vox.dex === null || vox.dex === undefined) {
    return p1
  }
  if (ct in vox.dex.context) {
    trans = vox.dex.context[ct][p1]
  }
  if (!trans) {
    trans = p1
  }
  vox.debug && console.log("_tc-trans:", trans)
  return trans
}

vox._t2 = function () {
  /**
   * This function is used to add pluralisation to the text.
   * First 2 arguments, are the text, singular & plural
   * '%s' will be replaced with the 3rd argument
   * Usage ( for en ):
   * _t2('I have %s apple','I have %s apples, 1) => Will translate to : "I have 1 apple"
   * _t2('I have %s apple','I have %s apples, 2) => Will translate to : "I have 2 apples"
   */
  if (arguments.length !== 3) {
    console.error("Empty invokation _t2 ->", new Error().stack.split("\n")[1])
    vox.debug && console.trace()
    return
  }

  let sg = arguments[0] // singular
  let pl = arguments[1] // plural
  let n = arguments[2] // the number
  let np = vox.pluralisation(n) // get pluralisation : 0 or 1 or 2 etc
  let trans = ""

  if (
    vox.dex &&
    sg in vox.dex.plural &&
    vox.dex.plural[sg][np] !== undefined &&
    vox.dex.plural[sg][np] !== ""
  ) {
    trans = vox.dex.plural[sg][np]
  } else {
    // as fallback or no match
    // english pluralisation -> plural: n!=1
    trans = n != 1 ? pl : sg
  }
  trans = trans.replace("%s", n)
  vox.debug && console.log("_t2-trans:", trans)
  return trans
}


// comment next line if used with vanilla javascript
export default vox
