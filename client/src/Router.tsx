import React from 'react'
import SiteMapAuthed from './components/SiteMap/SiteMapAuthed'
import SiteMapNotAuth from './components/SiteMap/SiteMapNotAuth'


type PropsType = {
  isToken: boolean
  token: string | null
}


export default ({isToken, token}: PropsType) => isToken ? <SiteMapAuthed token={token}/> : <SiteMapNotAuth />
