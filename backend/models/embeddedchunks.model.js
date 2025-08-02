import mongoose from 'mongoose';

const embeddedChunkSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

export default mongoose.model('EmbeddedChunk', embeddedChunkSchema);
