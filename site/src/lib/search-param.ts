/* eslint-disable no-console */
import { get, writable } from 'svelte/store'
import LZString from 'lz-string'
import { page } from '$app/stores'
import { goto } from '$app/navigation'

const { decompressFromEncodedURIComponent: decode, compressToEncodedURIComponent: encode } = LZString

const SSR = typeof window === 'undefined'

export interface SearchParamStoreOptions<T> {
  key: string
  replaceState?: boolean
  startWith?: T
  log?: boolean
  persist?: 'localStorage' | 'sessionStorage' | false
}

export function createSearchParamStore<T>(options: SearchParamStoreOptions<T>) {
  const {
    key,
    replaceState = true,
    startWith,
    log = false,
    persist = 'localStorage',
  } = options

  const storage = getStorage(persist)
  function getStorage(storageOption: 'localStorage' | 'sessionStorage' | false) {
    if (SSR)
      return
    if (!storageOption)
      return
    return storageOption === 'localStorage'
      ? localStorage
      : sessionStorage
  }

  // LOWEST priority: startWith - this will remain the value (if passed in) if the value is not found in the url or local storage
  const store = writable<T>(startWith, start)
  const { subscribe, set } = store

  function start() {
    // HIGHEST priority: url search param. Client side, this can be done via window.location.search, but the page store allows us to get it server side also, with the caveat that this must be initialized in a Svelte component
    const { url: { searchParams } } = get(page)
    const valueFromUrl = searchParams.get(key)
    if (valueFromUrl)
      return setFromSearchParam(valueFromUrl)

    if (SSR)
      return

    // MIDDLE priority: if not found in url, check localStorage/sessionStorage
    if (storage) {
      const encodedValue = storage.getItem(key)
      if (!encodedValue)
        return
      const value = decodeParam<T>(encodedValue)
      if (value)
        setFromStorage(value, encodedValue!)
    }
  }

  function setFromSearchParam(encodedValue: string) {
    const value = decodeParam<T>(encodedValue)!
    set(value)
    log && console.log(`URL set ${key} to ${value}`)

    if (SSR)
      return

    updateStorage(encodedValue)
  }

  function setFromStorage(value: T, encodedValue: string) {
    log && console.log(`${persist} set ${key} to ${value}`)
    set(value)
    updateSearchParam(encodedValue)
  }

  function setFromUserInteraction(value: T) {
    set(value)
    log && console.log(`user action changed: ${key} to ${value}`)

    if (SSR)
      return

    const encodedValue = encodeParam(value)
    updateSearchParam(encodedValue)
    updateStorage(encodedValue)
  }

  // See https://github.com/sveltejs/kit/issues/969 for query params store and goto discussions
  function updateSearchParam(encodedValue: string | null) {
    const url = new URL(window.location.href)

    if (encodedValue)
      url.searchParams.set(key, encodedValue)
    else
      url.searchParams.delete(key)

    goto(url.toString(), { replaceState, noScroll: true, keepFocus: true })
  };

  function updateStorage(encodedValue: string | null) {
    if (!storage)
      return
    if (encodedValue) {
      storage.setItem(key, encodedValue)
      log && console.log(`Update ${key} to be ${encodedValue} in ${persist}, left lz-string encoded for space saving`)
    }
    else {
      storage.removeItem(key)
      log && console.log(`Removed ${key} from ${persist}`)
    }
  }

  return {
    subscribe,
    set: setFromUserInteraction,
  }
}

function encodeParam(value: any): string | null {
  if (typeof value === 'undefined' || value === null) // specific check for undefined and null as we want 0 and false to be options in the store
    return null
  return encode(JSON.stringify(value))
}

function decodeParam<T>(value: string): T | undefined {
  if (typeof value === 'undefined' || value === null)
    return undefined
  const decoded = decode(value)
  try {
    return JSON.parse(decoded) as T
  }
  catch {
    // if a decoded string that was never JSON stringified (to save URL space) is parsed, it will throw an error and so we don't parse it but just return the string
    return decoded as T
  }
}
