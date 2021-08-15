const fs = require('fs')

function readWriteAsync() {
  // Update README using FS
  fs.readFile('README.md', 'utf-8', (err, data) => {
    if (err) {
      throw err
    }

    const updatedMd = data.replace(/\(https:\/\/github.com\)/, '(https://www.google.co.jp)')

    // Write the new README
    fs.writeFile('README.md', updatedMd, 'utf-8', (err) => {
      if (err) {
        throw err
      }
    })
  })
}

// Call the function
readWriteAsync()
