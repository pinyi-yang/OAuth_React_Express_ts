import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
  githubId: {
    type: Number,
    required: [true, 'You need to have a github id']
  }
})

userSchema.set('toObject', {
  transform: function(doc, ret, options) {
    let returnJson = {
      _id: ret._id,
      githubId: ret.githubId
    }
    return returnJson;
  }
})

export default mongoose.model('User', userSchema);