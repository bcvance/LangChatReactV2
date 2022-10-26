import { months } from '../constants/DateConstants'

export const getTimeFormat = (dateString) => {
    let date = new Date(dateString)
    let today = new Date()
    const diffMin = Math.abs(today - date) / (1000 * 60)
    const diffDays = Math.floor(diffMin / (60 * 24))
    // determine how to display send time of message
    if (diffMin < 1) {
      return 'Just now'
    }
    else if (diffMin < 60) {
      return diffMin < 2 ? `${Math.floor(diffMin)} minute ago` : `${Math.floor(diffMin)} minutes ago`
    }
    else if (diffDays < 1) {
      return Math.floor(diffMin / 60) < 2 ? `${Math.floor(diffMin / 60)} hour ago` : `${Math.floor(diffMin / 60)} hours ago`
    }
    else if (diffDays < 7) {
      return diffDays < 2 ? `${diffDays} day ago` : `${diffDays} days ago`
    }
    else if (diffDays < 32) {
      return Math.floor(diffDays / 7) < 2 ? `${Math.floor(diffDays / 7)} day ago` : `${Math.floor(diffDays / 7)} weeks ago`
    }
    else {
      return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
    }
  }

  export const getDisplayText = (mostRecent) => {
    // get first 20 characters of most recent message to display in conversation tab
    if (mostRecent.length < 30) {
      return mostRecent
    }
    return `${mostRecent.substring(0, 30)}...`
  }