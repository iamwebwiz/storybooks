const moment = require('moment')

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format)
  },
  truncate: function (content, length) {
    if (content.length > length && content.length > 0) {
      let newStr = `${content} `
      newStr = newStr.substr(0, length)
      newStr = newStr.substr(0, newStr.lastIndexOf(' '))
      newStr = newStr.length > 0 ? newStr : newStr.substr(0, length)

      return `${newStr}...`
    }

    return content
  },
  stripTags: function (content) {
    return content.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        let markup = `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue">`
        markup += `<i class="fas fa-edit fa-small"></i></a>`

        return markup
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
      }
    } else {
      return ''
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}
