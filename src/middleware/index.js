import config from '../../config'
var api = require('sendwithus')(config.mail_key)

export function errorMiddleware () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      ctx.status = err.status || 500
      ctx.body = err.message
      ctx.app.emit('error', err, ctx)
    }
  }
}

export function sendSignupMail (outbreak, microbe) {
  api.send({
    template: outbreak.signup_template,
    recipient: {
      address: microbe.email// required
    },
    email_data: {
      referral_link: `${outbreak.referral_url}?code=${microbe.referral_code}`,
      name: microbe.name ? microbe.name : '',
      email: microbe.email,
      referral_code: microbe.referral_code
    }
  }, (err, res) => {
    console.log(err, 'Signup Mail Error')
    console.log(res, 'Signup Mail Result')
  })
}

export function sendNudge (outbreak, referrer, microbe) {
  api.send({
    template: outbreak.nudge_template,
    recipient: {
      address: referrer.email// required
    },
    email_data: {
      referral_link: `${outbreak.referral_link}?code=${referrer.referral_code}`,
      referrers_count: referrer.microbials && referrer.microbials.length ? referrer.microbials.length : 0,
      name: referrer.name ? referrer.name : '',
      email: referrer.email,
      referral_code: referrer.referral_code,
      microbe_name: microbe.name ? microbe.name : '',
      microbe_email: microbe.email,
      microbe_referral_code: microbe.referral_code
    }
  }, (err, res) => {
    console.log(err, 'Nudge Mail Error')
    console.log(res, 'Nudge Mail Result')
  })
}
