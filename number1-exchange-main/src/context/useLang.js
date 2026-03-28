// src/context/useLang.js
import { useContext } from 'react'
import { LanguageContext } from './LanguageContext'

function useLang() { return useContext(LanguageContext) }
export default useLang