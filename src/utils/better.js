const better = {
  error: (err) => {
    if (err.body && err.body.message) {
      err.message = err.body.message
    }
    const errors = []
    if (err.errors) {
      for (const key in err.errors) {
        if (err.errors[key].message) {
          errors.push(err.errors[key].message)
        }
      }
    }
    const betterErrors = {
      errors,
      message: err.message
    }
    return { body: betterErrors }
  }
}

export default better
