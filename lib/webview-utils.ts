/**
 * Utility functions for webview compatibility
 */

// Detect if running in a webview environment
export function isWebView(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  
  // Common webview indicators
  const webviewIndicators = [
    'wv', // Android WebView
    'webview', // Generic webview
    'mobile safari', // iOS WebView
    'android', // Android app
    'iphone', // iOS app
  ]
  
  return webviewIndicators.some(indicator => userAgent.includes(indicator))
}

// Safe localStorage wrapper for webview compatibility
export class SafeStorage {
  private static isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 
             window.localStorage !== undefined &&
             window.localStorage !== null
    } catch {
      return false
    }
  }

  static getItem(key: string): string | null {
    if (!this.isAvailable()) {
      console.warn('localStorage not available in webview environment')
      return null
    }
    
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.warn('Error accessing localStorage:', error)
      return null
    }
  }

  static setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage not available in webview environment')
      return false
    }
    
    try {
      localStorage.setItem(key, value)
      return true
    } catch (error) {
      console.warn('Error setting localStorage:', error)
      return false
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage not available in webview environment')
      return false
    }
    
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.warn('Error removing from localStorage:', error)
      return false
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage not available in webview environment')
      return false
    }
    
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.warn('Error clearing localStorage:', error)
      return false
    }
  }
}

// Safe fetch wrapper for webview compatibility
export async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Check if required APIs are available
export function checkWebViewCompatibility(): {
  localStorage: boolean
  fetch: boolean
  isWebView: boolean
} {
  return {
    localStorage: SafeStorage.isAvailable(),
    fetch: typeof fetch !== 'undefined',
    isWebView: isWebView(),
  }
}

// Initialize webview compatibility
export function initWebViewCompatibility(): void {
  if (typeof window === 'undefined') return
  
  const compatibility = checkWebViewCompatibility()
  
  console.log('WebView Compatibility Check:', compatibility)
  
  // Add webview class to body for CSS targeting
  if (compatibility.isWebView) {
    document.body.classList.add('webview-environment')
  }
  
  // Warn about missing features
  if (!compatibility.localStorage) {
    console.warn('localStorage not available - some features may not work properly')
  }
  
  if (!compatibility.fetch) {
    console.warn('fetch API not available - network requests may fail')
  }
}
