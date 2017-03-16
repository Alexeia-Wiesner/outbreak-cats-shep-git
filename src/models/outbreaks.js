import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
import cuid from 'cuid'

const Outbreak = new Schema({
  owner: { type: ObjectId, required: true, ref: 'users' },
  name: { type: String, required: true },
  referral_url: { type: String },
  outbreak_id: { type: String, default: () => { return cuid.slug() } },
  signup_template: { type: String },
  nudge_template: { type: String },
  completion_template: { type: String },
  number_of_nudges: { type: Number, required: true, default: 5 }

}, {
  timestamps: true
})

export default mongoose.model('outbreaks', Outbreak)
