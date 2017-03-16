import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
import cuid from 'cuid'

const Microbe = new Schema({
  outbreak_id: { type: ObjectId, required: true, ref: 'outbreaks' },
  outbreak_slug: { type: String },
  name: { type: String },
  email: { type: String, required: true },
  mobile: { type: String },
  id_number: { type: String },
  referral_code: { type: String, default: () => { return cuid.slug() } },
  microbials: [{ type: ObjectId, ref: 'microbes' }]
}, {
  timestamps: true
})

Microbe.index({ email: 1, outbreak_id: 1 }, { unique: true })
Microbe.on('index', function (err) { console.log(err, 'WWWWWWWWW') })
export default mongoose.model('microbes', Microbe)
