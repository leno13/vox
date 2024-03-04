const { useState, useEffect } = React

function Hello() {
  return (
    <div>
      <h1>{vox._t("SOAD - Hypnotize")}</h1>
      <p>{vox._t2()}</p>
      <p>{vox._t('Why don\'t you ask the kids at Tienanmen Square')}</p>
      <p>{vox._t('Was fashion the reason why they were there')}</p>
      <hr></hr>
      <p>{vox._t2('I have %s apple', 'I have %s apples',20)}</p>
    </div>
  )
}

async function beginRender() {
  console.log('beginRender')

  vox.initPluralisation()
  let URL = `/res/de.json`
  // let URL = `./msg/${vox.lang}.json`
  vox.dex = await vox.fetchDict(URL)

  const container = document.getElementById("root")
  const root = ReactDOM.createRoot(container)
  root.render(<Hello />)
}

beginRender()
