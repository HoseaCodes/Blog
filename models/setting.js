import mongoose from 'mongoose';

/*
  Small key/value store for admin-side configuration that does not deserve a
  model of its own. Currently one row: `roadmap`, holding the calendar anchor
  the Gantt labels its month axis from.
*/
const settingSchema = new mongoose.Schema({
  key: { type: String, trim: true, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingSchema);

export default Settings;
