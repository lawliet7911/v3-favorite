import { ToolbarNames } from 'md-editor-v3'

export interface noteItem {
  id: string
  title: string
  time: string
  encryption: string | number
  delVisible: boolean
}

export interface collectionItem {
  id: string
  description: string
  name: string
  secret: string
}

export interface saveModel {
  title: string
  text: string
  time: string
  uid: null | string
  encryption: number | string
  id: undefined | string | null
}

export interface noteBookData {
  nsfwVisible: boolean
  noteListF: noteItem[]
  noteList: noteItem[]
  dialogVisible: boolean
  editLoading: boolean
  listLoading: boolean
  formData: any
  user: any
  text: string // 转换md值
  textOrigin: string
  currentChoose: noteItem
  encryptionStatus: number
  encryptionFlag: boolean
  sortType: number
  currentCid: string
  collections: collectionItem[]
  toolbarsExclude: ToolbarNames[]
}
